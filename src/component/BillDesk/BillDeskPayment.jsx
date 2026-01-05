import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const BillDeskPayment = () => {
    const { application_no } = useParams();
  const location = useLocation();
  const paymentData = location.state;
  useEffect(() => {
    const loadScripts = async () => {
        console.log(paymentData,"paymentData")
      // Load SDK CSS (optional: if you want styles)
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://pay.billdesk.com/jssdk/v1/dist/billdesksdk/billdesksdk.css';
      document.head.appendChild(link);

      // Load jQuery
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-latest.min.js';
      document.body.appendChild(jqueryScript);

      // Load BillDesk SDK (module)
      const sdkScript = document.createElement('script');
      sdkScript.type = 'module';
      sdkScript.src = 'https://pay.billdesk.com/jssdk/v1/dist/billdesksdk/billdesksdk.esm.js';
      document.body.appendChild(sdkScript);

      // Wait a bit to ensure scripts load
      setTimeout(() => {
        initializePaymentFlow();
      }, 1000);
    };

    const paymentData = {
  mercid: "UMPMKHTV2",
  bdorderid: "BDORD456",
  authorization:"HyXyUWc9OjhTFZDPCS2sMiglJ48WrQcR",
  ru: "https://htsanyojan.mpcz.in:8089/ht_load_change/lc_payment_process"
};

    const initializePaymentFlow = () => {
      const flow_config = {
        merchantId: "UMPMKHTV2",
        bdOrderId: "TSSGF43214F",
        authToken: "'HyXyUWc9OjhTFZDPCS2sMiglJ48WrQcR'",
        returnUrl:"https://htsanyojan.mpcz.in:8089/ht_load_change/lc_payment_process" ,
        prefs: {
          payment_categories: ['card', 'nb'],
        },
        childWindow: false,
        returnUrl: "https://pguatweb.billdesk.io/pgtxnsimulator/v1_2/pageclose",
      };

      const responseHandler = (response) => {
        console.log('responseHandler callback received');
        console.log(response);

        if (response.txnResponse) {
          const encodedres = btoa(JSON.stringify(response));
          const form = document.createElement('form');
          form.setAttribute('id', 'pgresponse');
          form.setAttribute('method', 'post');
          form.setAttribute('action', 'https://pguatweb.billdesk.io/pgtxnsimulator/v1_2/pageclose');

          const input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', 'encodedres');
          input.setAttribute('value', encodedres);
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        }

        if (response.status === 111) {
          window.history.back();
          alert('Modal Closed By User');
        }
      };

      const config = {
        responseHandler: responseHandler,
        flowConfig: flow_config,
        flowType: 'payments',
      };

      if (window.loadBillDeskSdk) {
        window.loadBillDeskSdk(config);
      } else {
        console.error("BillDesk SDK not loaded");
      }
    };

    loadScripts();
  }, [paymentData]);

  return <div>Loading BillDesk Payment...</div>;
};

export default BillDeskPayment;