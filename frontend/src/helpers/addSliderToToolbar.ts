export default function addSliderToToolbar({
  id,
  title,
  range,
  step,
  defaultValue,
  container,
  onSelectedValueChange,
  updateLabelOnChange,
}: {
  id?: string;
  title: string;
  range: number[];
  step?: number;
  defaultValue: number;
  container?: HTMLElement;
  onSelectedValueChange: (value: string) => void;
  updateLabelOnChange?: (value: string, label: HTMLElement) => void;
}) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (id) {
    input.id = id;
    label.id = `${id}-label`;
  }

  label.htmlFor = title;
  label.innerText = title;

  input.type = 'range';
  input.min = String(range[0]);
  input.max = String(range[1]);
  input.value = String(defaultValue);
  input.name = title;
  // add step
  if (step) {
    input.step = String(step);
  }

  input.oninput = (evt) => {
    const selectElement = evt.target as HTMLSelectElement;


    if (selectElement) {
      onSelectedValueChange(selectElement.value);
      if (updateLabelOnChange !== undefined) {
        updateLabelOnChange(selectElement.value, label);
      }
    }
  };

  // Check if container is null
  if (container === null) {
    console.error('Container is null!');
    return;
  }

  // If container is not null, append elements
  container?.append(label);
  container?.append(input);
}
