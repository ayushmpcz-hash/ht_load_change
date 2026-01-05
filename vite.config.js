import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss(),],
   server:{
    proxy: {
      // 1. Proxy for: https://htsanyojan.mpcz.in:8089/api/*
      '/api': {
        target: 'https://htsanyojan.mpcz.in:8089',
        changeOrigin: true,
        secure: false, // if SSL is self-signed
      },
      '/media': {
        target: 'https://htsanyojan.mpcz.in:8089',
        changeOrigin: true,
        secure: false,
      },
      '/ht_load_change': {
        target: 'https://htsanyojan.mpcz.in:8089/',
        changeOrigin: true,
        secure: false,
      },
       '/htngb_backend': {
        target: 'https://uathtngb.mpcz.in:8888',
        changeOrigin: true,
        secure: false,
      }
      ,
       '/htngb_backend/api': {
        target: 'https://ht.mpcz.in',
        changeOrigin: true,
        secure: false,
      }
      ,
       '/newerp': {
        target: 'https://dsp.mpcz.in:8888/',
        changeOrigin: true,
        secure: false,
      },
       '/tkc': {
        target: 'https://qcportal.mpcz.in',
        changeOrigin: true,
        secure: false,
      },
      // tkc/get_tkc_category
      // tkc/get_tkc_by_oyt/${contractor_category_id}
      // tkc/get_reg_date/${Contractor_name_id}`
      
      //    '/billdesk': {
      //   target: 'https://uat1.billdesk.com/merchant-uat',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/billdesk/, ''),
      // },
      
    }
  },
})

// https://uathtngb.mpcz.in:8888/htngb_backend/api/masters/getHtSdCalculationDetail/HV-3.1.B
