"use client"

import { TextField, TextFieldInput } from "@/smui/primitives/text-field"
import { Button } from "@/smui/primitives/button"
import { Disclosure, DisclosurePanel, DisclsoureHeading } from "@/smui/primitives/disclosure"

export default function Page() {
  return (
    <div>
      <Disclosure>
        {(_, classNames) => (
          <>
            <DisclsoureHeading className={classNames.heading}>
              <Button slot="trigger">Trigger</Button>
            </DisclsoureHeading>
            <DisclosurePanel className={classNames.panel}>Panel Content</DisclosurePanel>
          </>
        )}
      </Disclosure>
      <TextField classNames={{ input: "border" }}>
        {(_, classNames) => <TextFieldInput className={classNames.input} />}
      </TextField>
    </div>
  )
}
