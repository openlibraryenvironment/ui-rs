`<SmartUserCard>` takes a `userId` prop and displays the user with that ID. It's the only component in this directory that we'd expect to be used by client code.

To make this work, we need to connect an underlying component `<ConnectableUserCard>`. But to get the connect function from the Stripes object, we first need to furnish that objct to another underlying component, `<StripesableUserCard>`. So the call sequence goes:

> client &rarr; `<SmartUserCard>` &rarr; `<StripesableUserCard>` &rarr; `<ConnectableUserCard>`

This seems more complicated than it should need to be. Is there a simpler way?

