const merge = (a, b) =>
  Object.assign(
    {},
    a,
    ...Object.entries(b).map(([k, v]) =>
      v === undefined || (typeof v === "number" && isNaN(v)) || v === null ? {} : { [k]: v }
    )
  );
module.exports = { merge };

const toBoolean = (val) => val === "true";
