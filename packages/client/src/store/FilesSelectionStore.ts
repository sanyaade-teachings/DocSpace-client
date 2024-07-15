import { makeAutoObservable } from "mobx";

import { TFile, TFolder } from "@docspace/shared/api/files/types";
import { TRoom } from "@docspace/shared/api/rooms/types";
import { Nullable } from "@docspace/shared/types";

export type TSelection = (TFile | TFolder | TRoom)[];
export type TBufferSelection = Nullable<TFile | TFolder | TRoom>;
export type TSelected = "close" | "none";

class FilesSelectionStore {
  selection: TSelection = [];

  bufferSelection: TBufferSelection = null;

  selected: TSelected = "close";

  constructor() {
    makeAutoObservable(this);
  }

  setSelection = (selection: TSelection) => {
    this.selection = selection;
  };

  setBufferSelection = (bufferSelection: TBufferSelection) => {
    this.bufferSelection = bufferSelection;
  };

  setSelected = (selected: TSelected) => {
    this.selected = selected;
  };
}

export default FilesSelectionStore;
