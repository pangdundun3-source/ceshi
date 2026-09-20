export type AppClientKey = 'v8_web' | 'v8_mobile' | 'mt_admin' | 'wechat';

export interface AppClientDef {
  key: AppClientKey;
  name: string;
  description: string;
}

export const APP_CLIENTS: AppClientDef[] = [
  { key: 'v8_web', name: 'V8 客户端', description: 'PC 浏览器用户工作台' },
  { key: 'v8_mobile', name: '移动端', description: '手机 H5 / App 工作台' },
  { key: 'mt_admin', name: 'MT 管理端', description: '后台管理控制台' },
  { key: 'wechat', name: '微信端', description: '公众号 / 小程序入口' },
];

export type AppClientModules = Partial<Record<AppClientKey, string[]>>;

export const getAppClientByKey = (key: string) =>
  APP_CLIENTS.find((item) => item.key === key);

export const enabledClientKeys = (configs?: AppClientModules): AppClientKey[] =>
  APP_CLIENTS.map((item) => item.key).filter((key) => Array.isArray(configs?.[key]));

export const defaultClientModules = (pageModules: string[]): AppClientModules => ({
  v8_web: [...pageModules],
  mt_admin: [...pageModules],
});

export const pruneClientModules = (
  configs: AppClientModules | undefined,
  pageModules: string[]
): AppClientModules => {
  if (!configs) return {};
  const next: AppClientModules = {};
  (Object.keys(configs) as AppClientKey[]).forEach((key) => {
    const mods = configs[key];
    if (!Array.isArray(mods)) return;
    next[key] = mods.filter((item) => pageModules.includes(item));
  });
  return next;
};

export const ensureClientModules = (
  configs: AppClientModules | undefined,
  pageModules: string[]
): AppClientModules => {
  const pruned = pruneClientModules(configs, pageModules);
  if (enabledClientKeys(pruned).length > 0) return pruned;
  return defaultClientModules(pageModules);
};
