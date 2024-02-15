import type { PropsWithChildren } from "react";

import type { DeviceType } from "@docspace/shared/enums";
import type { TUser } from "@docspace/shared/api/people/types";
import type FirebaseHelper from "@docspace/shared/utils/firebase";
import type { TWhiteLabel } from "@docspace/shared/utils/whiteLabelHelper";
import type { TColorScheme } from "@docspace/shared/themes";

export interface ErrorBoundaryProps extends PropsWithChildren {
  onError?: VoidFunction;
  user: TUser;
  version: string;
  firebaseHelper: FirebaseHelper;
  currentDeviceType: DeviceType;
  whiteLabelLogoUrls: TWhiteLabel[];
  currentColorScheme?: TColorScheme;
}

export interface ErrorBoundaryState {
  error: Error | null;
}