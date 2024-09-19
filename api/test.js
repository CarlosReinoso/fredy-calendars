module.exports = async (req, res) => {
  try {
    console.log("testing");

    res.statusCode = 200;
    return res.json({
      message: "Testing went well",
    });
  } catch (error) {
    console.error("Error during test", error);
    res.statusCode = 500;
    return res.json({
      message: "Error during test",
      error,
    });
  }
};
