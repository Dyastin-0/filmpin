import Button from "../ui/Button";

const EditModeSection = ({ isEditMode, handleSave, toggleEditMode }) => {
  return (
    <div className="flex justify-end items-center gap-2 w-full">
      {isEditMode && (
        <div className="flex flex-col gap-2 w-full items-center text-xs text-primary-foreground">
          <div className="flex items-center gap-2">
            <span>You are in edit mode.</span>
            <Button text="Save" onClick={handleSave} />
            <Button variant="ghost" text="Exit" onClick={toggleEditMode} />
          </div>
          <span>
            Tip: drag and drop to reorder items in the list; the first item in
            the list will be the list's backdrop; the first four items will be
            displayed in the list's poster.
          </span>
        </div>
      )}
    </div>
  );
};

export default EditModeSection;
