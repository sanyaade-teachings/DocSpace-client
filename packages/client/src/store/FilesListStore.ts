import { TFile, TFolder } from "@docspace/shared/api/files/types";
import { makeAutoObservable } from "mobx";

class FilesSelectionStore {
  files: TFile[] = [];

  folders: TFolder[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export default FilesSelectionStore;
