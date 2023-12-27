import React from "react";

import { Avatar } from "@docspace/shared/components";
import { Text } from "@docspace/shared/components";
import { Checkbox } from "@docspace/shared/components";
const GroupHeader = ({
  avatarUrl,
  label,
  selectedCount,
  isMultiSelect,
  onSelectAll,
  isIndeterminate,
  isChecked,
  ...rest
}) => {
  const [groupLabel, setGroupLabel] = React.useState(label);

  React.useEffect(() => {
    if (isMultiSelect) {
      selectedCount > 0
        ? setGroupLabel(`${label} (${selectedCount})`)
        : setGroupLabel(`${label}`);
    }
  }, [selectedCount, isMultiSelect, label]);

  return (
    <>
      <div className="row-option row-header">
        <div className="option-info">
          <Avatar
            className="option-avatar"
            role="user"
            size="min"
            source={avatarUrl}
            userName={label}
          />
          <Text
            className="option-text option-text__header"
            truncate={true}
            noSelect={true}
            fontSize="14px"
          >
            {groupLabel}
          </Text>
        </div>
        {isMultiSelect && (
          <Checkbox
            isIndeterminate={isIndeterminate}
            isChecked={isChecked}
            onChange={onSelectAll}
            className="option-checkbox"
          />
        )}
      </div>
    </>
  );
};

export default React.memo(GroupHeader);
