// src/layouts/root/components/app-sidebar.jsx

import { useEffect, useState } from "react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { sidebarData } from "@/lib/voteria-data";
import { useAuthStore } from "@/store/authStore";
import { useSpacesStore } from "@/store/spacesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Rocket,
  Orbit, // Changed from Sparkles
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

function mapSpaceToProject(space) {
  return {
    name: `v/${space.title}`,
    url: `/space/${space.id}`,
    icon: Orbit,
    id: space.id,
  };
}

export function AppSidebar(props) {
  const token = useAuthStore((state) => state.token);
  const {
    subscribedSpaces,
    fetchSubscriptions,
    createSpace,
    createLoading,
    createError,
  } = useSpacesStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchSubscriptions();
  }, [token, fetchSubscriptions]);

  const projects = subscribedSpaces.map(mapSpaceToProject);

  const handleCreateSpace = async () => {
    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    setFormError(null);
    const result = await createSpace(title.trim(), description.trim());
    if (result.success) {
      resetAndClose();
    } else {
      setFormError(result.error ?? "Failed to create space.");
    }
  };

  const resetAndClose = () => {
    setModalOpen(false);
    setTitle("");
    setDescription("");
    setFormError(null);
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <NavMain items={sidebarData.navMain} />
          <NavProjects projects={projects} />

          <SidebarGroup className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Create Space"
                  onClick={() => setModalOpen(true)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium flex justify-evenly"
                >
                  <Rocket className="size-4" />
                  <span>Create Space</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Create Space Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md shadow-xl">
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Updated modal header icon and background to match */}
                  <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Orbit className="size-4" />
                  </div>
                  <h2 className="text-base font-semibold text-card-foreground">
                    Create a new space
                  </h2>
                </div>
                <Button size="icon-sm" variant="ghost" onClick={resetAndClose}>
                  <X className="size-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Give your community a name and a short description so people
                know what it's about.
              </p>

              {/* Fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Web Development, Gaming, etc."
                    maxLength={50}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What is this space about?"
                    className="min-h-24"
                    maxLength={200}
                  />
                </div>
              </div>

              {(formError || createError) && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {formError || createError}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateSpace}
                  disabled={
                    createLoading || !title.trim() || !description.trim()
                  }
                >
                  {createLoading ? "Creating…" : "Create space"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
