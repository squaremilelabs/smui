"use client"

import { Button } from "@/smui/primitives/button"
import { Disclosure, DisclosurePanel, DisclsoureHeading } from "@/smui/primitives/disclosure"

export default function Page() {
  return (
    <div>
      <Disclosure>
        {(_renderProps, classNames) => (
          <>
            <DisclsoureHeading className={classNames.heading}>
              <Button slot="trigger">Trigger</Button>
            </DisclsoureHeading>
            <DisclosurePanel className={classNames.panel}>Panel Content</DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
