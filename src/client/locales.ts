/** Copy owned by the optional DeepSeek Chat page. */
export const zh = {
  title: 'DeepSeek 聊天',
  back: '后退',
  forward: '前进',
  reload: '刷新',
  'load.failed': '页面加载失败；请刷新重试。',
} satisfies Record<string, string>

/** English copy with the same keys. */
export const en = {
  title: 'DeepSeek Chat',
  back: 'Back',
  forward: 'Forward',
  reload: 'Reload',
  'load.failed': 'The page could not load; reload and try again.',
} satisfies Record<keyof typeof zh, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Desktop DeepSeek Chat navigation and failures. */
    deepseekChat: keyof typeof zh
  }
}
