import { ZodError } from "zod";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    console.error("Validation failed:", JSON.stringify(err.flatten()));
    return res.status(400).json({
      error: "Validation failed",
      details: err.flatten()
    });
  }
  if (err.code === "23505") {
    return res.status(409).json({
      error: "An account with that phone number already exists"
    });
  }
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  if (status === 500) {
    console.error(err);
  }
  return res.status(status).json({
    error: message,
    details: err.details
  });
}