"use strict";
const path = require("path");
const FileHelper = require("./file-helper");
const Parameters = require("./parameters").get();
const WalletType = require("./wallet-type");

const objectToCsv = require("csv-writer").createObjectCsvWriter;

module.exports.exportBalances = async (symbol, balances, format, toBlock) => {
  const withType = await WalletType.addType(balances);

  const writeCsv = () => {
    const file = Parameters.outputFileName.replace(/{token}/g, `${symbol}-${toBlock}.csv`);
    FileHelper.ensureDirectory(path.dirname(file));

    const writer = objectToCsv({
      path: file,
      header: [{ id: "wallet", title: "Wallet" }, { id: "balance", title: "Balance" }, { id: "type", title: "Type" }]
    });

    console.log("Exporting CSV");
    writer.writeRecords(withType).then(() => console.log("CSV export done!"));
  };

  if (["csv", "both"].indexOf(format.toLowerCase()) > -1) {
    writeCsv();

    if (format.toLowerCase() === "csv") {
      return;
    }
  }

  console.log("Exporting JSON");
  await FileHelper.writeFile(Parameters.outputFileName.replace(/{token}/g, `${symbol}-${toBlock}.json`), withType);
  console.log("JSON export done!");
};
