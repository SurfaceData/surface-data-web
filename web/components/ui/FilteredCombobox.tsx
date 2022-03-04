import { useCombobox } from 'downshift';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  box-sizing: border-box;
  margin-bottom: 30px;
  flex: 1 0 34%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  margin-left: 9px;
  padding: 0 5px;
  position: absolute;
  top: -8px;
  z-index: 1;
  background: #fff;
  font-size: 12px;
  color: #959595;
`;

const Input = styled.input`
  box-sizing: border-box;
  border: 1.6px solid #e6e4e1;
  margin-bottom: 30px;
  border-radius: 2px;
  padding: 13px;
  font-size: 16px;
  color: #000;
  background-color: #fff;

  :focus {
    border-color: #000;
    outline: none;
  }
`;

const List = styled.ul`
  margin: -30px 0 30px;
  padding: 0;
  background: #fff;
  z-index: 1;
  width: 100%;
  border: 1px solid #f3f2f0;
  box-sizing: border-box;
  box-shadow: 0 2px 5px 0 #f3f2f0;
  overflow: hidden;
`;

const ListItem = styled.li`
  cursor: pointer;
  list-style: none;
  padding: 15px;

  :hover {
    background-color: #f3f2f0;
  }
`;

interface FilteredComboboxProps {
  label: string,
  placeholder: string,
  items: any[],
  itemToKey: (any) => string,
  itemToName: (any) => string,
  filterItems: (string) => Promise<any[]>,
}

export const FilteredCombobox = ({
  label,
  placeholder,
  items,
  filterItems,
  itemToName,
  itemToKey,
}: FilteredComboboxProps) => {
	const [inputItems, setInputItems] = useState(items);
	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		getComboboxProps,
		highlightedIndex,
		getItemProps,
	} = useCombobox({
		items: inputItems,
    itemToString: itemToName,
		onInputValueChange: ({ inputValue }) => {
      filterItems(inputValue).then(setInputItems);
		},
	})
  return (
    <Container>
      <Label {...getLabelProps()}>{label}</Label>
      <div {...getComboboxProps()} >
        <Input {...getInputProps()} placeholder={placeholder} />
      </div>
      <List {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            <ListItem
              key={itemToKey(item)}
              {...getItemProps({ item, index })}>
              {itemToName(item)}
            </ListItem>
          ))}
      </List>
    </Container>
  );
};
