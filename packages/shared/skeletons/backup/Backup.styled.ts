import styled from "styled-components";
import { mobile, tablet } from "@docspace/shared/utils";

export const StyledDataBackup = styled.div`
  width: 100%;
  .data-backup-loader_main {
    display: grid;
    grid-template-rows: 1fr;
    grid-gap: 8px;
    width: 100%;
    .data-backup-loader_title {
      max-width: 118px;
    }
    .data-backup-loader_title-description {
      display: block;
      max-width: 700px;
      width: 100%;
      height: 16px;
      @media ${mobile} {
        height: 32px;
      }
    }
  }
  .data-backup-loader {
    margin-top: 24px;
    display: grid;
    grid-template-rows: repeat(5, max-content);
    grid-template-columns: 16px 1fr;
    width: 100%;
    grid-column-gap: 8px;
    .data-backup-loader_menu,
    .data-backup-loader_menu-higher,
    .data-backup-loader_menu-last {
      height: 40px;
      max-width: 700px;
      width: 100%;
      margin-bottom: 16px;
    }
    .data-backup-loader_menu-higher {
      height: 72px;
      @media ${mobile} {
        height: 120px;
      }
    }
    .data-backup-loader_menu-last {
      height: 56px;
      @media ${mobile} {
        height: 88px;
      }
    }
    .data-backup-loader_menu-description {
      margin-bottom: 16px;
      height: 32px;
      max-width: 285px;
      width: 100%;
      @media ${tablet} {
        height: 40px;
      }
    }
  }
`;

export const StyledAutoBackup = styled.div`
  width: 100%;
  .auto-backup-loader_main {
    display: grid;
    grid-template-rows: max-content max-content max-content;
    grid-gap: 8px;
    width: 100%;
    .auto-backup-loader_title {
      max-width: 118px;
    }
    .auto-backup-loader_title-description {
      display: block;
      max-width: 700px;
      width: 100%;
      height: 16px;
      @media ${mobile} {
        height: 32px;
      }
    }
    .auto-backup-loader_toggle {
      max-width: 718px;
      height: 64px;
    }
  }
  .auto-backup-loader_menu {
    margin-top: 24px;
    display: grid;
    grid-template-rows: repeat(5, max-content);
    grid-template-columns: 16px 1fr;
    width: 100%;
    grid-column-gap: 8px;
    .auto-backup-loader_option {
      height: 40px;
      max-width: 700px;
      @media ${tablet} {
        height: 54px;
      }
    }
    .auto-backup-loader_option-description {
      margin-top: 8px;
      height: 32px;
      max-width: 350px;
    }
    .auto-backup-loader_option-description-second {
      margin-top: 16px;
      height: 20px;
      max-width: 119px;
    }
    .auto-backup-loader_option-description-third,
    .auto-backup-loader_option-description-fourth {
      margin-top: 4px;
      height: 32px;
      max-width: 350px;
    }
  }
`;

export const StyledRestoreBackup = styled.div`
  width: 100%;
  .restore-backup-loader_title {
    max-width: 400px;
    height: 12px;
    @media ${mobile} {
      height: 30px;
    }
  }
  .restore-backup_checkbox {
    margin-top: 24px;
    margin-bottom: 24px;
    display: grid;
    grid-template-rows: repeat(3, max-content);
    grid-template-columns: 16px 1fr;
    grid-column-gap: 8px;
    grid-row-gap: 16px;
    .restore-backup_checkbox-first {
      max-width: 61px;
      height: 20px;
    }
    .restore-backup_checkbox-second {
      max-width: 418px;
      height: 20px;
      @media ${mobile} {
        height: 40px;
      }
    }
    .restore-backup_checkbox-third {
      max-width: 122px;
      height: 20px;
    }
  }
  .restore-backup_input {
    max-width: 350px;
    margin-bottom: 16px;
  }
  .restore-backup_backup-list {
    max-width: 130px;
    display: block;
  }
  .restore-backup_notification {
    margin-bottom: 24px;
    margin-top: 11px;
    display: grid;
    // grid-template-rows: repeat(3, max-content);
    grid-template-columns: 16px 1fr;
    grid-column-gap: 8px;
    grid-row-gap: 16px;
    .restore-backup_notification-title {
      max-width: 315px;
    }
  }
  .restore-backup_warning-title {
    max-width: 72px;
  }
  .restore-backup_warning-description {
    display: block;
    height: 32px;
    max-width: 700px;
    @media ${mobile} {
      height: 48px;
    }
  }
  .restore-backup_warning {
    margin-top: 17px;
    margin-bottom: 24px;
    display: block;
    height: 20px;
    max-width: 700px;
    @media ${mobile} {
      height: 31px;
    }
  }
  .restore-backup_button {
    display: block;
    max-width: 100px;
    height: 32px;
    @media ${mobile} {
      height: 40px;
      max-width: 100%;
    }
  }
`;