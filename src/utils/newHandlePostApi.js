export const SendDataForToken = async (formData, url,token) => {
  const requestOptions = {
    method: 'POST',
    body:formData,
    redirect: 'follow',
     headers: {
      "Content-Type": "multipart/form-data"
      // 'Authorization': `Bearer ${token}`
    },
  };
  const response = await fetch(`${url}`, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response;

}
export const getNgbToken = async (formData, url) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(formData),
    redirect: 'follow',
     headers: {
     'Content-Type': 'application/json',
     },
  };
  const response = await fetch(`${url}`, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response;

}
export const getFinalUsingDataToken = async (url,token) => {
  console.log(token,'token in apiii')
  const response = await fetch(
    `${url}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 const result = await response.json();
  return result; 
};