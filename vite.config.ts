import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { AndDesignVueResolve, createStyleImportPlugin } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  // 开发服务器
  server: {
    proxy: { // 代理配置
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/images": {
        target: "http://localhost:3002",
        changeOrigin: true,
      }
    },
  },
  // 插件列表
  plugins: [
    vue(), // 支持Vue
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      imports: [
        'vue', 
        'vue-router',
        { 'pinia': ['storeToRefs'] },
        { from: 'ant-design-vue', imports: ['FormInstance'], type: true },
        { from: 'ant-design-vue/es/form', imports: ['Rule'], type: true }
      ],
      dirs: ['./src/api', './src/store', './src/hooks']
    }),
    Components({
      dts: "./src/types/components.d.ts",
      resolvers: [AntDesignVueResolver({ resolveIcons: true })]
    }),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#ff4655',
          'link-color': '#ff4655',
          'border-radius-base': '2px',
          'spin-dot-size-lg': '120px',
          'menu-item-active-bg': '#ff4655',
        },
        javascriptEnabled: true,
      },
    },
  }
})
