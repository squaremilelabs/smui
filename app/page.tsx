"use client"

import { Button, ButtonGroup } from "@/smui/primitives/button"
import { Checkbox, CheckboxGroup } from "@/smui/primitives/checkbox"
import { Disclosure, DisclosurePanel, DisclsoureHeading } from "@/smui/primitives/disclosure"
import { GridList, GridListItem } from "@/smui/primitives/grid-list"
import { ListBox, ListBoxItem, ListBoxSection } from "@/smui/primitives/list-box"
import { TextField, TextFieldInput, TextFieldTextArea } from "@/smui/primitives/text-field"
import { FieldDescription, FieldError, FieldLabel } from "@/smui/primitives/field"

export default function Page() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="border-b text-xl font-bold">Button</h1>
        <h2 className="text-lg font-semibold">Button</h2>
        <Button className="self-start">Click me</Button>
        <h2 className="text-lg font-semibold">ButtonGroup</h2>
        <ButtonGroup classNames={{ base: "flex gap-1", button: "border" }}>
          {(_, classNames) => (
            <>
              <Button className={classNames.button}>Left</Button>
              <Button className={classNames.button}>Center</Button>
              <Button className={classNames.button}>Right</Button>
            </>
          )}
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="border-b text-xl font-bold">Checkbox</h1>
        <h2 className="text-lg font-semibold">Checkbox</h2>
        <Checkbox classNames={{ base: "flex" }}>Check me</Checkbox>
        <h2 className="text-lg font-semibold">CheckboxGroup</h2>
        <CheckboxGroup aria-label="CheckboxGroup" classNames={{ checkbox: { base: "flex " } }}>
          {(renderProps, classNames) => (
            <>
              <Checkbox value={"1"} classNames={classNames.checkbox}>
                Option 1
              </Checkbox>
              <Checkbox value={"2"} classNames={classNames.checkbox}>
                Option 2
              </Checkbox>
              <Checkbox value={"3"} classNames={classNames.checkbox}>
                Option 3
              </Checkbox>
            </>
          )}
        </CheckboxGroup>
        <h2 className="text-lg font-semibold">CheckboxGroup with Field Components</h2>
        <CheckboxGroup
          fieldVariants={{}}
          classNames={{ checkbox: { base: "flex" }, field: { base: "flex flex-col" } }}
        >
          {(renderProps, classNames) => (
            <>
              <FieldLabel className={classNames.field.label}>Choose options</FieldLabel>
              <Checkbox value={"1"} classNames={classNames.checkbox}>
                Option 1
              </Checkbox>
              <Checkbox value={"2"} classNames={classNames.checkbox}>
                Option 2
              </Checkbox>
              <Checkbox value={"3"} classNames={classNames.checkbox}>
                Option 3
              </Checkbox>
              <FieldDescription className={classNames.field.description}>
                Select one or more options
              </FieldDescription>
              <FieldError className={classNames.field.error}>Error message</FieldError>
            </>
          )}
        </CheckboxGroup>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="border-b text-xl font-bold">Disclosure</h1>
        <Disclosure>
          {(renderProps, classNames) => (
            <>
              <DisclsoureHeading className={classNames.heading}>
                <Button slot="trigger">{renderProps.isExpanded ? "Collapse" : "Expand"}</Button>
              </DisclsoureHeading>
              <DisclosurePanel className={classNames.panel}>Content</DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="border-b text-xl font-bold">GridList</h1>
        <GridList
          aria-label="GridList"
          items={[
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
            { id: 3, name: "Item 3" },
          ]}
        >
          {(item, classNames) => (
            <GridListItem id={item.id} textValue={item.name} className={classNames.item}>
              {item.name}
            </GridListItem>
          )}
        </GridList>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="border-b text-xl font-bold">ListBox</h1>
        <h2 className="text-lg font-semibold">Basic (Items only)</h2>
        <ListBox
          aria-label="ListBox"
          items={[
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
            { id: 3, name: "Item 3" },
          ]}
        >
          {(item, classNames) => (
            <ListBoxItem id={item.id} textValue={item.name} className={classNames.item}>
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>

        <h2 className="text-lg font-semibold">With Sections</h2>
        <ListBox
          aria-label="ListBox with Sections"
          items={[
            {
              id: "section1",
              name: "Section 1",
              items: [
                { id: 1, name: "Item 1.1" },
                { id: 2, name: "Item 1.2" },
              ],
            },
            {
              id: "section2",
              name: "Section 2",
              items: [
                { id: 1, name: "Item 2.1" },
                { id: 2, name: "Item 2.2" },
              ],
            },
          ]}
        >
          {(section, classNames) => (
            <ListBoxSection
              id={section.id}
              items={section.items}
              classNames={classNames.section}
              header={<p>{section.name}</p>}
            >
              {(item) => (
                <ListBoxItem id={item.id} textValue={item.name} className={classNames.item}>
                  {item.name}
                </ListBoxItem>
              )}
            </ListBoxSection>
          )}
        </ListBox>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="border-b text-xl font-bold">TextField</h1>
        <h2 className="text-lg font-semibold">Basic (with Input)</h2>
        <TextField aria-label="TextField" classNames={{ input: "border" }}>
          {(_, classNames) => <TextFieldInput className={classNames.input} />}
        </TextField>
        <h2 className="text-lg font-semibold">With TextArea</h2>
        <TextField aria-label="TextField" classNames={{ textarea: "border" }}>
          {(_, classNames) => <TextFieldTextArea className={classNames.textarea} />}
        </TextField>
        <h2 className="text-lg font-semibold">With FieldComponents</h2>
        <TextField
          fieldVariants={{}}
          classNames={{ input: "border", field: { base: "flex flex-col" } }}
        >
          {(_, classNames) => (
            <>
              <FieldLabel className={classNames.field.label}>Label</FieldLabel>
              <TextFieldInput className={classNames.input} />
              <FieldDescription className={classNames.field.description}>
                Description
              </FieldDescription>
              <FieldError className={classNames.field.error}>Error</FieldError>
            </>
          )}
        </TextField>
      </div>
    </div>
  )
}
