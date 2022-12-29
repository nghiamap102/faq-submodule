# [0.8.0]() (2022-01-28)

### Change added

* Added `dynamicContent` props to AdvanceSelectPopup, which trigger AnchorOverlay to re-calculate AdvanceSelectPopup position in remote search case.
* Added `isLoading` props to AdvanceSelect, which show in both AdvanceSelectControl & AdvanceSelectPopup. Suitable to use with searchable AdvanceSelect (remote search mode).
* Added `onControlClick` props ,trigger when click to AdvanceSelectControl. User can handle AdvanceSelect visibility from the outside.
* Added `onDropdownClosed` props ,trigger when AdvanceSelectPopup closed. User can handle custom behavior after select a value.
* Removed AdvanceSelect's `clear` icon when searching with `searchable` prop.
* Added confirm popup when remove tag in AdvanceSelect multi select.

### Bug fixes

* Fixed clearable AdvanceSelect value in-correct when clear button clicked (when reset AdvanceSelect's value to to empty string).
* Fixed AdvanceSelect not showing value when options is empty (async options).
* Fixed AdvanceSelect reset to empty string when search value not found in options.
* Fixed AdvanceSelectPopup cannot scroll in safari (cross browser compatibility).
* Fixed get wrong value when select `non-select` item.
* Fixed not close the popup when scroll outside it.
