import { createWriteStream } from "fs";

async function fetchList(page, pageSize = 24) {
  const response = await fetch("https://192.168.2.232:8000/api/jsonrpc", {
    rejectUnauthorized: false,
    body: JSON.stringify({
      method: "gallery.List",
      params: [
        {
          page,
          pageSize,
          searchWords: [],
          types: [
            "doujinshi",
            "manga",
            "artistCG",
            "gameCG",
            "western",
            "nonH",
            "imageSet",
            "cosplay",
            "asianPorn",
            "misc",
          ],
          tags: [],
          authToken: "xxxxx",
        },
      ],
      id: 1,
    }),
    method: "POST",
  });

  const data = await response.json();
  const gallerys = data.result.gallerys;
  const total = data.result.total;

  return { gallerys, total };
}

const filledlFile = createWriteStream("./filled.csv");
const unfilledFile = createWriteStream("./unfilled.csv");
const emptyFile = createWriteStream("./empty.csv");

const filledlshFile = createWriteStream("./filled.sh");

const BASE_DIR = "/mnt/ehd_data/data";

const { total } = await fetchList(1);
const pageSize = 48;
const totalPage = Math.ceil(total / pageSize);

let lines = 0;
let tarFileName = "";

for (let i = 1; i <= totalPage; i += 1) {
  const { gallerys } = await fetchList(i, pageSize);
  gallerys.forEach((item) => {
    const rowText = [
      item.gid + "_" + item.gHash,
      item.length,
      item.pages.length,
    ].join(",");
    if (item.pages.length === 0) {
      emptyFile.write(rowText + "\n");
    } else if (item.pages.length < item.length) {
      unfilledFile.write(rowText + "\n");
    } else {
      filledlFile.write(rowText + "\n");
      if (lines % 500 === 0) {
        tarFileName = `test_${Date.now()}.tar`;
        filledlshFile.write(`touch ${tarFileName}\n`);
      }
      filledlshFile.write(
        `tar -cvf ${tarFileName} -C ${BASE_DIR} ${item.gid + "_" + item.gHash}\n`
      );
      lines += 1;
    }
  });
  console.log(`page ${i} of ${totalPage} proceed.`);
}

filledlFile.close();
unfilledFile.close();
emptyFile.close();
filledlshFile.close();

// tar -cvf test.tar
// tar -rvf test.tar
// tar -cvf test.tar -C /mnt/ehd_data/data 1767481_4f2ccf034b
// tar -rvf test.tar -C /mnt/ehd_data/data 1767481_4f2ccf034b
