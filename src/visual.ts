"use strict";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom";
import BarChartVisual, { initialState, State } from "./ReactBartChart"; 
import { VisualFormattingSettingsModel } from "./settings";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.renderReactComponent(initialState);
        this.formattingSettingsService = new FormattingSettingsService();
    }

    public update(options: VisualUpdateOptions) {
        const dataView = options.dataViews && options.dataViews[0];

        if (dataView) {
            this.extractDataAndUpdate(dataView);
        } else {
            this.clear();
        }
    }

    private extractDataAndUpdate(dataView: DataView) {
        console.log(dataView)
        const categories = dataView.categorical?.categories[0]?.values as string[] || [];
        const values = dataView.categorical?.values[0]?.values as number[] || [];

        // Populate formatting settings model
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            dataView
        );

        // Extract formatting settings
        const rangeColor = this.formattingSettings.dataPointCard.rangeColor.value.value || "#fea151"; // Default color
        const minRange = this.formattingSettings.dataPointCard.minRange.value || 0; // Default min range
        const maxRange = this.formattingSettings.dataPointCard.maxRange.value || 100; // Default max range
        const selectedCategory = this.formattingSettings.dataPointCard.selectCategory.value.value; // Selected category
        // Filter the data based on the selected category
        const filteredData = categories.map((name: string, index: number) => {
            const quantity = Number(values[index]);
            const fillColor = (quantity >= minRange && quantity <= maxRange) ? rangeColor : "#fea151";

            return {
                name: name,
                quantity: quantity,
                fill: fillColor
            };
        }).filter(data => {
            return (   
                selectedCategory === 'All Categories'
            )
            
        }); 

        // Update React component with new data
        BarChartVisual.update({
            filteredData,
            startRange: minRange,
            endRange: maxRange,
            color: rangeColor
        });
    }

    private clear() {
        BarChartVisual.update(initialState);
    }

    private renderReactComponent(initialState: State) {
        this.reactRoot = React.createElement(BarChartVisual, {});
        ReactDOM.render(this.reactRoot, this.target);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
