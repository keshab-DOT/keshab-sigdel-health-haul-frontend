const Esewa = async () => {

  const res = await axios.post(
    "http://localhost:3000/api/payment/esewa/initiate",
    { amount: 100 }
  );

  const data = res.data;

  const form = document.createElement("form");
  form.method = "POST";
  form.action =
    "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

  Object.keys(data).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};