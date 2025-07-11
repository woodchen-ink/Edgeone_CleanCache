"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Save, Trash, CheckCircle2, XCircle, Pencil } from "lucide-react";
import Link from "next/link";

interface SavedConfig {
  id: string;
  name: string;
  secretId: string;
  secretKey: string;
  zoneId: string;
}

interface EOApiResponse {
  Response: {
    RequestId: string;
    JobId: string;
    FailedList: string[];
    Error?: {
      Message: string;
      Code: string;
    };
  };
}

export function CleanCacheForm() {
  const [secretId, setSecretId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<EOApiResponse | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [configName, setConfigName] = useState("");
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [urls, setUrls] = useState("");
  const [prefixes, setPrefixes] = useState("");
  const [hosts, setHosts] = useState("");
  const [tags, setTags] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // 加载保存的配置列表
    const configs = localStorage.getItem("savedConfigs");
    if (configs) {
      setSavedConfigs(JSON.parse(configs));
    }
  }, []);

  const saveConfig = () => {
    if (!configName.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入配置名称",
      });
      return;
    }

    if (!secretId || !secretKey || !zoneId) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写完整的配置信息！",
      });
      return;
    }

    let updatedConfigs: SavedConfig[];
    
    if (editingConfigId) {
      // 编辑现有配置
      updatedConfigs = savedConfigs.map(config => {
        if (config.id === editingConfigId) {
          return {
            ...config,
            name: configName,
            secretId,
            secretKey,
            zoneId
          };
        }
        return config;
      });
      
      toast({
        title: "成功",
        description: "配置已更新",
      });
    } else {
      // 添加新配置
      const newConfig: SavedConfig = {
        id: Date.now().toString(),
        name: configName,
        secretId,
        secretKey,
        zoneId,
      };
      
      updatedConfigs = [...savedConfigs, newConfig];
      
      toast({
        title: "成功",
        description: "配置已保存",
      });
    }

    setSavedConfigs(updatedConfigs);
    localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));
    setSaveDialogOpen(false);
    setConfigName("");
    setEditingConfigId(null);
  };

  const editConfig = (config: SavedConfig) => {
    setConfigName(config.name);
    setSecretId(config.secretId);
    setSecretKey(config.secretKey);
    setZoneId(config.zoneId);
    setEditingConfigId(config.id);
    setSaveDialogOpen(true);
  };

  const loadConfig = (config: SavedConfig) => {
    setSecretId(config.secretId);
    setSecretKey(config.secretKey);
    setZoneId(config.zoneId);

    toast({
      title: "成功",
      description: "配置已加载",
    });
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));

    toast({
      title: "成功",
      description: "配置已删除",
    });
  };

  const purgeUrls = async () => {
    if (!urls.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入需要刷新的URL",
      });
      return;
    }
    
    await callApi("purge_url", urls.split("\n").map(t => t.trim()).filter(t => t));
  };

  const purgePrefixes = async () => {
    if (!prefixes.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入需要刷新的目录",
      });
      return;
    }
    
    await callApi("purge_prefix", prefixes.split("\n").map(t => t.trim()).filter(t => t));
  };

  const purgeHosts = async () => {
    if (!hosts.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入需要刷新的主机",
      });
      return;
    }
    
    await callApi("purge_host", hosts.split("\n").map(t => t.trim()).filter(t => t));
  };

  const purgeTags = async () => {
    if (!tags.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入需要刷新的缓存标签",
      });
      return;
    }
    
    await callApi("purge_cache_tag", tags.split("\n").map(t => t.trim()).filter(t => t));
  };

  const purgeAll = async () => {
    await callApi("purge_all", []);
  };

  const callApi = async (type: string, targets: string[], method = "invalidate") => {
    if (!secretId || !secretKey || !zoneId) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请填写完整的配置信息！",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/eo-cleancache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secretId,
          secretKey,
          zoneId,
          type,
          targets,
          method,
        }),
      });

      const result = await response.json();
      setResult(result);
      setDialogOpen(true);

      if (result.Response && !result.Response.Error) {
        toast({
          title: "成功",
          description: "操作成功！",
        });
      } else {
        toast({
          variant: "destructive",
          title: "失败",
          description: `操作失败：${
            result.Response?.Error?.Message || "未知错误"
          }`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "错误",
        description: `请求失败：${(error as Error).message}`,
      });
      setResult({ 
        Response: {
          RequestId: "",
          JobId: "",
          FailedList: [],
          Error: {
            Message: (error as Error).message,
            Code: "RequestError"
          }
        }
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>腾讯云EdgeOne缓存刷新工具</CardTitle>
        <CardDescription>
          数据保存在浏览器本地，不会上传到任何服务器。通用国内站和国际站。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-base">已保存的配置</CardTitle>
                <CardDescription>点击配置名称可快速加载</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setConfigName("");
                  setEditingConfigId(null);
                  setSaveDialogOpen(true);
                }}
                className="h-8 w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                保存当前配置
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {savedConfigs.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无保存的配置</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {savedConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent group"
                  >
                    <button
                      onClick={() => loadConfig(config)}
                      className="flex-1 text-left text-sm font-medium truncate"
                    >
                      {config.name}
                    </button>
                    <div className="flex opacity-0 group-hover:opacity-100 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          editConfig(config);
                        }}
                        className="h-6 w-6"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConfig(config.id);
                        }}
                        className="h-6 w-6"
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>SecretId</Label>
            <Input
              value={secretId}
              onChange={(e) => setSecretId(e.target.value)}
              placeholder="请输入 SecretId"
            />
            <div className="text-sm text-muted-foreground space-y-1">
              <Link
                href="https://console.cloud.tencent.com/cam/capi"
                target="_blank"
                className="underline block"
              >
                国内站: https://console.cloud.tencent.com/cam/capi
              </Link>
              <Link
                href="https://console.intl.cloud.tencent.com/cam/capi"
                target="_blank"
                className="underline block"
              >
                国际站: https://console.intl.cloud.tencent.com/cam/capi
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <Label>SecretKey</Label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="请输入 SecretKey"
            />
          </div>

          <div className="space-y-2">
            <Label>ZoneId</Label>
            <Input
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="请输入 ZoneId"
            />
            <div className="text-sm text-muted-foreground space-y-1">
              <Link
                href="https://console.cloud.tencent.com/edgeone/zones"
                target="_blank"
                className="underline block"
              >
                国内站: https://console.cloud.tencent.com/edgeone/zones
              </Link>
              <Link
                href="https://console.intl.cloud.tencent.com/edgeone/zones"
                target="_blank"
                className="underline block"
              >
                国际站: https://console.intl.cloud.tencent.com/edgeone/zones
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full sm:grid sm:grid-cols-5 h-auto p-1 gap-1">
              <TabsTrigger 
                value="all" 
                className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                刷新全部
              </TabsTrigger>
              <TabsTrigger 
                value="url" 
                className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                URL刷新
              </TabsTrigger>
              <TabsTrigger 
                value="prefix" 
                className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                目录刷新
              </TabsTrigger>
              <TabsTrigger 
                value="host" 
                className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Host刷新
              </TabsTrigger>
              <TabsTrigger 
                value="tag" 
                className="flex-shrink-0 text-xs sm:text-sm px-3 py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Cache Tag
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>刷新全部缓存</CardTitle>
                <CardDescription>
                  将清理该域名下的所有缓存文件
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={purgeAll}
                >
                  刷新所有缓存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url">
            <Card>
              <CardHeader>
                <CardTitle>按URL刷新</CardTitle>
                <CardDescription>
                  输入需要刷新的URL地址，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="http://example.com/file1.jpg"
                  className="min-h-[120px] sm:min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={purgeUrls}
                >
                  刷新指定URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prefix">
            <Card>
              <CardHeader>
                <CardTitle>按目录刷新</CardTitle>
                <CardDescription>
                  输入需要刷新的目录，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prefixes}
                  onChange={(e) => setPrefixes(e.target.value)}
                  placeholder="http://example.com/images/"
                  className="min-h-[120px] sm:min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={purgePrefixes}
                >
                  刷新指定目录
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="host">
            <Card>
              <CardHeader>
                <CardTitle>按主机刷新</CardTitle>
                <CardDescription>
                  输入需要刷新的主机名，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={hosts}
                  onChange={(e) => setHosts(e.target.value)}
                  placeholder="www.example.com"
                  className="min-h-[120px] sm:min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={purgeHosts}
                >
                  刷新指定主机
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tag">
            <Card>
              <CardHeader>
                <CardTitle>按Cache Tag刷新 (仅企业版)</CardTitle>
                <CardDescription>
                  输入需要刷新的缓存标签，每行一个
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1&#10;tag2&#10;tag3"
                  className="min-h-[120px] sm:min-h-[150px]"
                />
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={purgeTags}
                >
                  刷新指定标签
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {result?.Response && !result.Response.Error ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>操作成功</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span>操作失败</span>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {result?.Response && !result.Response.Error ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                  <p className="font-medium">缓存清理成功！</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>任务ID: {result.Response.JobId}</p>
                    <p>请求ID: {result.Response.RequestId}</p>
                    {result.Response.FailedList?.length === 0 && (
                      <p className="text-green-600">所有项目清理成功</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  <p className="font-medium">清理失败</p>
                  <p className="text-sm mt-1">
                    {result?.Response?.Error?.Message || "未知错误"}
                  </p>
                </div>
              )}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">详细信息：</p>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingConfigId ? "编辑配置" : "保存配置"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>配置名称</Label>
                <Input
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="请输入配置名称"
                />
              </div>
              
              <div className="space-y-2">
                <Label>SecretId</Label>
                <Input
                  value={secretId}
                  onChange={(e) => setSecretId(e.target.value)}
                  placeholder="请输入 SecretId"
                />
              </div>
              
              <div className="space-y-2">
                <Label>SecretKey</Label>
                <Input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="请输入 SecretKey"
                />
              </div>
              
              <div className="space-y-2">
                <Label>ZoneId</Label>
                <Input
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  placeholder="请输入 ZoneId"
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => {
                setSaveDialogOpen(false);
                setEditingConfigId(null);
              }} className="w-full sm:w-auto">
                取消
              </Button>
              <Button onClick={saveConfig} className="w-full sm:w-auto">{editingConfigId ? "更新" : "保存"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}