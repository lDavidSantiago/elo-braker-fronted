import React from "react";
import {Drawer} from "vaul";
import {Button} from "@/components/ui/button";

export default function Playground() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-10">
            <h1 className="text-3xl font-bold mb-6">UI Playground</h1>

            <Button variant="outline" onClick={() => setOpen(true)}>
                Open Drawer (fixed)
            </Button>

            <Drawer.Root open={open} onOpenChange={setOpen}>
                {/* ✅ Portal al body para evitar recortes */}
                <Drawer.Portal
                    container={typeof document !== "undefined" ? document.body : undefined}
                >
                    <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50"/>

                    <Drawer.Content
                        className="fixed inset-x-0 bottom-0 z-[100] mt-24 max-h-[80vh] rounded-t-lg border border-white/10 bg-neutral-950 p-4">
                        {/* handle */}
                        <div className="mx-auto mb-4 h-2 w-[100px] rounded-full bg-white/10"/>

                        <div className="mx-auto w-full max-w-sm">
                            <div className="space-y-1 text-center">
                                <h2 className="text-lg font-semibold">Drawer test</h2>
                                <p className="text-sm text-white/60">
                                    This one is portaled to body (no clipping).
                                </p>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <Button className="w-full">Submit</Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    );
}