const input = document.getElementById("input");
const modaldiv = document.getElementById("modaldiv");
input.addEventListener("change", async () => {
  modaldiv.style.display = "flex";
  const files = input.files;
  if (files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target.result;
      const sendData = (filedata) => {
        return new Promise((resolve, reject) => {
          window.electronAPI.sendDatafile(filedata, (error, info) => {
            if (error) {
              reject;
            } else {
              resolve(info);
            }
          });
        });
      };
      const table = document.getElementById("tbody");
      sendData({ filename: file.name, data: buffer })
        .then((resData) => {
          console.log(resData);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(
          window.electronAPI.receiveData((resData) => {
            resData.forEach((item, index) => {
              const rowCount = table.rows.length;
              const row = table.insertRow();
              const cell1 = row.insertCell(0);
              const cell2 = row.insertCell(1);
              const cell3 = row.insertCell(2);
              const cell4 = row.insertCell(3);
              const cell5 = row.insertCell(4);
              const cell6 = row.insertCell(5);
              cell1.innerHTML = rowCount + 1;
              cell2.innerHTML = item.from;
              cell3.innerHTML = item.to;
              cell4.innerHTML = item.cc;
              cell5.innerHTML = item.subject;
              cell6.innerHTML = item.text;
            });
            modaldiv.style.display = "none";
          })
        );
    };
    reader.readAsArrayBuffer(file);
  }
});
