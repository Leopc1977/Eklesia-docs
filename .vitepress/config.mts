import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/Eklesia-docs/",
  title: "Eklesia documentation",
  description: "Eklesia documentation",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'What is Eklesia', link: '/what-is-eklesia' },
      { text: 'Getting Started', link: '/getting-started/installation' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'API Reference', link: '/reference/api' },
      { text: 'Contributing', link: '/contributing/how-to-contribute' },
    ],    

    sidebar: [
      {
        text: 'Prologue',
        items: [
          { text: 'What is Eklesia', link: '/what-is-eklesia' },
        ],
      },
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/getting-started/installation' },
          { text: 'Quick Start', link: '/getting-started/quick-start' },
        ],
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Arena', link: '/core-concepts/arena' },
          { text: 'Orchestrator', link: '/core-concepts/orchestrator' },
          { text: 'Environment', link: '/core-concepts/environment' },
          { text: 'Agent', link: '/core-concepts/agent' },
          { text: 'Provider', link: '/core-concepts/provider' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Custom Orchestrator', link: '/advanced/custom-orchestrator' },
          { text: 'Custom Environment', link: '/advanced/custom-environment' },
          { text: 'Custom Agent', link: '/advanced/custom-agent' },
          { text: 'Custom Provider', link: '/advanced/custom-provider' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API', link: '' },
          { text: 'Examples', link: 'https://github.com/Leopc1977/Eklesia/tree/main/examples' },
        ],
      },
      {
        text: 'Contributing',
        items: [
          { text: 'How to Contribute', link: '/contributing/how-to-contribute' },
          { text: 'License', link: '/contributing/license' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Leopc1977/Eklesia' }
    ]
  }
})
