import { useEffect, useState } from "react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { sidebarData } from "@/lib/voteria-data";
import { useAuthStore } from "@/store/authStore";
import { useSpacesStore } from "@/store/spacesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Plus, FolderIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

function mapSpaceToProject(space) {
  return {
    name: `v/${space.title}`,
    url: "/",
    icon: FolderIcon,
    id: space.id,
  };
}

export function AppSidebar(props) {
  const token = useAuthStore((state) => state.token);
  const {
    subscribedSpaces,
    loading: spacesLoading,
    subscriptionsLoading,
    error: spacesError,
    subscriptionsError,
    fetchSubscriptions,
    createSpace,
    createLoading,
    createError,
  } = useSpacesStore();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchSubscriptions();
  }, [token, fetchSubscriptions]);

  useEffect(() => {
    if (spacesError || subscriptionsError) {
      setFormError(spacesError || subscriptionsError);
    }
  }, [spacesError, subscriptionsError]);

  useEffect(() => {
    if (createError) {
      setFormError(createError);
    }
  }, [createError]);

  const projects = subscribedSpaces.map(mapSpaceToProject);

  const handleCreateSpace = async () => {
    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    setFormError(null);
    const result = await createSpace(title.trim(), description.trim());

    if (result.success) {
      setTitle("");
      setDescription("");
      setSheetOpen(false);
    } else {
      setFormError(result.error ?? "Failed to create space.");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <div className="px-4 py-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="w-full justify-center" icon={Plus}>
                Create Space
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-sm">
              <SheetHeader>
                <SheetTitle>Create a new space</SheetTitle>
                <SheetDescription>
                  Give your space a title and a short description.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Space title"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Short description"
                    className="mt-2 min-h-24"
                  />
                </div>
                {formError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {formError}
                  </p>
                )}
              </div>
              <SheetFooter className="px-4 pb-4 pt-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleCreateSpace}
                  disabled={createLoading}
                >
                  {createLoading ? "Creating…" : "Create space"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
