import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;

class DataPointCardSettings extends formattingSettings.SimpleCard {
    rangeColor = new formattingSettings.ColorPicker({
        name: "rangeColor",
        displayName: "Range Color",
        value: { value: "#fea151" }, 
    });

    minRange = new formattingSettings.NumUpDown({
        name: "minRange",
        displayName: "Min Range",
        value: 0,
    });

    maxRange = new formattingSettings.NumUpDown({
        name: "maxRange",
        displayName: "Max Range",
        value: 100,
    });
    selectCategory = new formattingSettings.ItemDropdown({
        name: "selectCategory",
        displayName: "Select Category",
        value: { value: "Gadgets", displayName: "Gadgets" }, 
        items: [
            { value: "Gadgets", displayName: "Gadgets" },
            { value: "Accessories", displayName: "Accessories" },
            { "value": "All Categories", "displayName": "All Categories" }

        ]
    });

    public name: string = "redirection";
    public displayName: string = "Data Point Settings";
    public slices: FormattingSettingsSlice[] = [this.rangeColor, this.minRange, this.maxRange, this.selectCategory];
}

export class VisualFormattingSettingsModel extends formattingSettings.Model {
    public dataPointCard = new DataPointCardSettings();
    public cards = [this.dataPointCard];
}
