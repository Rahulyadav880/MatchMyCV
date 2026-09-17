import { parseCertifications } from "./certification-parser.js";

const text = `
AWS Certified Cloud Practitioner
Amazon Web Services
2025

Oracle Java SE 17 Developer
Oracle
2025

Google Data Analytics Professional Certificate
Google
2024

AWS Certified Developer | Amazon Web Services | 2025
`;

console.log(
  JSON.stringify(
    parseCertifications(text),
    null,
    2,
  ),
);