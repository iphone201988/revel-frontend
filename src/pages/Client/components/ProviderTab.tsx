import { ChevronDown, Search, Users, X } from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { TabsContent } from "../../../components/Tabs";
import { Label } from "../../../components/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/PopOver";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../components/Command";
import { Separator } from "../../../components/Seprator";




const ProviderTab = () => {
  return (
    <>
      <TabsContent value="providers">
            <Card className="p-6 bg-white">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-[#395159]" />
                  <h3 className="text-[#303630]">Provider Team</h3>
                </div>
                <p className="text-[#395159]">
                  Manage the providers assigned to work with this client
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Provider</Label>
                  <p className="text-sm text-[#395159] mb-3">
                    Search and select a provider to add to this client's team
                  </p>
                  
                  <Popover open={providerSearchOpen} onOpenChange={setProviderSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={providerSearchOpen}
                        className="w-full h-12 justify-between bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-[#395159]" />
                          <span className="text-[#395159]">Search providers...</span>
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search providers..." />
                        <CommandList>
                          <CommandEmpty>No provider found.</CommandEmpty>
                          <CommandGroup>
                            {providersList.filter(p => !assignedProviders.includes(p.id)).map((provider) => (
                              <CommandItem
                                key={provider.id}
                                value={provider.name}
                                onSelect={() => addProviderToClient(provider.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="text-[#303630]">{provider.name}</span>
                                  <span className="text-sm text-[#395159]">{provider.credential}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Assigned Providers ({assignedProviders.length})</Label>
                  {assignedProviders.length === 0 ? (
                    <div className="p-8 text-center bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                      <Users className="w-12 h-12 mx-auto mb-3 text-[#395159] opacity-50" />
                      <p className="text-[#395159]">No providers assigned to this client yet</p>
                      <p className="text-sm text-[#395159] mt-1">Use the search above to add providers</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignedProviders.map((providerId) => {
                        const provider = providersList.find(p => p.id === providerId);
                        return provider ? (
                          <div
                            key={providerId}
                            className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] flex items-center justify-between"
                          >
                            <div>
                              <p className="text-[#303630]">{provider.name}</p>
                              <p className="text-sm text-[#395159]">{provider.credential}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeProviderFromClient(providerId)}
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
    </>
  )
}

export default ProviderTab


