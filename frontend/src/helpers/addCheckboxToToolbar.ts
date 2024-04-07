export default function addCheckboxToToolbar({
  id,
  title,
  checked,
  container,
  onChange,
}: {
  id?: string;
  title: string;
  checked?: boolean;
  container?: HTMLElement;
  onChange: (checked: boolean) => void;
}) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (id) {
    input.id = id;
    label.id = `${id}-label`;
  }

  label.htmlFor = title;
  label.innerText = title;

  input.type = 'checkbox';
  input.checked = !!checked;
  input.name = title;
  input.addEventListener('change', (evt) => {
    const checkboxElement = evt.target as HTMLInputElement;

    if (onChange) {
      onChange(checkboxElement.checked);
    }
  });

  // Check if container is provided and valid, otherwise use a default container
  if (container && container instanceof HTMLElement) {
    container.append(label);
    container.append(input);
  } else {
    const defaultContainer = document.getElementById('demo-toolbar');
    if (defaultContainer) {
      defaultContainer.append(label);
      defaultContainer.append(input);
    } else {
      console.error('Could not find default container');
    }
  }
}