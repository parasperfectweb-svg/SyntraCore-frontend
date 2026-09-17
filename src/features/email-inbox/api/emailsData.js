export const MOCK_EMAILS = [
  {
    id: 1, initials: "PS", color: "#2563eb", name: "Priya Sharma", email: "priya.sharma@portfreight.in",
    to: "search@outlook.com", time: "10:24 AM", fullTime: "Today, 10:24 AM",
    subject: "FCL Shipment from Kopero Rot", fullSubject: "FCL Shipment from Koper to Rotterdam",
    preview: "Hi, I need a quote for a full contair...", tag: { text: "Logistics", type: "logistics" }, unread: true,
    bodyHtml: `
  <p>Dear Team,</p>
  <p>I hope this message finds you well. I am writing to request a quotation for a Full Container Load (FCL) shipment from <strong>Koper</strong> to <strong>Rotterdam, Netherlands</strong>.</p>
  <p>Please find the shipment details below:</p>
  <div class="sc-detail-box">
    <div class="sc-detail-row">Origin Port: <strong>Koper</strong></div>
    <div class="sc-detail-row">Destination Port: <strong>Rotterdam (NLRTM), Netherlands</strong></div>
    <div class="sc-detail-row">Cargo Type: <strong>Non-Perishable Goods</strong></div>
    <div class="sc-detail-row">Container: <strong>1 × 40' HC</strong></div>
    <div class="sc-detail-row">Gross Weight: <strong>20,000 KG</strong></div>
    <div class="sc-detail-row">Commodity: <strong>Textile Machinery Parts</strong></div>
    <div class="sc-detail-row">Incoterms: <strong>CIF Rotterdam</strong></div>
    <div class="sc-detail-row">Required ETD: <strong>June 28, 2026</strong></div>
  </div>
  <p>Could you please provide us with your best FCL rates including all surcharges? We would also appreciate details on the estimated transit time and any documentation requirements.</p>
  <p>Looking forward to your prompt response.</p>
`,
    signature: { lines: ["Best regards,", "Priya Sharma", "Freight Manager – Port Freight India Pvt. Ltd.", "+91 22 4567 8900"] }
  },
  {
    id: 2, initials: "AH", color: "#16a34a", name: "Ava Hamilton", email: "ava.hamilton@nordicshipping.com",
    to: "search@outlook.com", time: "9:41 AM", fullTime: "Today, 9:41 AM",
    subject: "Re: Container Availability", fullSubject: "Re: Container Availability",
    preview: "Thanks for the update. Can you c...", unread: true, star: true,
    bodyHtml: `
  <p>Hi there,</p>
  <p>Thanks for the update. Can you confirm equipment availability for next week's booking? We have three additional 20' standard containers to add to the shipment plan.</p>
  <p>Please also let us know if the current freight rate holds for the added volume, or if a revised quote is needed.</p>
  <p>Appreciate your quick turnaround on this.</p>
`,
    signature: { lines: ["Regards,", "Ava Hamilton", "Logistics Coordinator – Nordic Shipping Co."] }
  },
  {
    id: 3, initials: "EN", color: "#7c3aed", name: "Emily Nguyen", email: "emily.nguyen@vantagecargo.com",
    to: "search@outlook.com", time: "Yesterday", fullTime: "Yesterday, 4:12 PM",
    subject: "Quotation Request – Hazmat Carg", fullSubject: "Quotation Request – Hazmat Cargo",
    preview: "We need a quotation for a hazardous...", unread: false,
    bodyHtml: `
  <p>Hello,</p>
  <p>We need a quotation for a hazardous materials shipment (IMO Class 3, flammable liquids) moving from Ho Chi Minh City to Long Beach, USA.</p>
  <p>Could you confirm whether your carrier network accepts Class 3 cargo on this lane, and share any additional documentation or certification requirements on top of the standard MSDS?</p>
  <p>Looking forward to your response.</p>
`,
    signature: { lines: ["Best,", "Emily Nguyen", "Compliance & Logistics – Vantage Cargo Solutions"] }
  },
  {
    id: 4, initials: "MD", color: "#c2410c", name: "Marcus Delgado", email: "marcus.delgado@atlascarriers.com",
    to: "search@outlook.com", time: "Yesterday", fullTime: "Yesterday, 11:05 AM",
    subject: "Greetings – Special Offer on FCL F", fullSubject: "Greetings – Special Offer on FCL Rates",
    preview: "Dear partner, we're pleased to offer c...", unread: false,
    bodyHtml: `
  <p>Dear partner,</p>
  <p>We're pleased to offer competitive FCL rates on the Asia–Europe corridor for bookings confirmed before the end of this month, with discounted rates on 40' HC containers for volume shippers.</p>
  <p>Let us know if you'd like a tailored rate sheet for your regular trade lanes.</p>
`,
    signature: { lines: ["Warm regards,", "Marcus Delgado", "Business Development – Atlas Carriers"] }
  },
  {
    id: 5, initials: "TL", color: "#0d9488", name: "Tanaka Logistics", email: "docs@tanakalogistics.jp",
    to: "search@outlook.com", time: "Mon", fullTime: "Monday, 2:30 PM",
    subject: "Notification Required – Custom", fullSubject: "Notification Required – Customs Documentation",
    preview: "Please provide the required docur...", tag: { text: "Urgent", type: "urgent" }, unread: true,
    bodyHtml: `
  <p>Dear Team,</p>
  <p>Please provide the required customs documentation for the pending shipment (Bill of Lading, Commercial Invoice, and Packing List) at your earliest convenience — customs clearance cannot proceed without these.</p>
  <p>The vessel is scheduled to arrive in three business days, so we'd appreciate a response by end of day tomorrow.</p>
`,
    signature: { lines: ["Regards,", "Tanaka Logistics", "Customs Documentation Team"] }
  },
  {
    id: 6, initials: "TS", color: "#db2777", name: "Tika Singl", email: "tika.singl@baypacific.com",
    to: "search@outlook.com", time: "Mon", fullTime: "Monday, 9:15 AM",
    subject: "Re: Rate Inquiry – LCL Bangkok", fullSubject: "Re: Rate Inquiry – LCL Bangkok",
    preview: "Hello, following up on the LCL shipme...", unread: false,
    bodyHtml: `
  <p>Hello,</p>
  <p>Following up on the LCL shipment quote request for the Bangkok to Singapore route — has a rate been finalized on your end? Our client is looking to confirm the booking this week.</p>
  <p>Let me know if any additional cargo details are needed.</p>
`,
    signature: { lines: ["Thanks,", "Tika Singl", "Freight Coordinator – Bay Pacific Logistics"] }
  },
  {
    id: 7, initials: "RP", color: "#1e3a8a", name: "Koper Auth.", email: "operations@koperport-auth.si",
    to: "search@outlook.com", time: "Sun", fullTime: "Sunday, 6:48 PM",
    subject: "Berth Confirmation – Vessel MAEF", fullSubject: "Berth Confirmation – Vessel Assignment",
    preview: "Berth confirmed for MAERSK ELBA, E...", unread: false, star: true,
    bodyHtml: `
  <p>Dear Operator,</p>
  <p>Berth allocation has been confirmed for the incoming vessel at Terminal 2, with an estimated arrival window as previously scheduled.</p>
  <p>Please ensure all pre-arrival documentation is submitted at least 24 hours prior to berthing to avoid delays.</p>
`,
    signature: { lines: ["Regards,", "Koper Port Authority", "Terminal Operations"] }
  },
  {
    id: 8, initials: "CB", color: "#6b7280", name: "Customs Brokerage Co.", email: "billing@customsbrokerageco.com",
    to: "search@outlook.com", time: "Jun 10", fullTime: "June 10, 3:20 PM",
    subject: "Invoice #INV-20240612 Attached", fullSubject: "Invoice #INV-20240612 Attached",
    preview: "Please find attached invoice for custo...", unread: false,
    bodyHtml: `
  <p>Dear Client,</p>
  <p>Please find attached the invoice for customs clearance services rendered on your recent shipment. Payment is due within 15 business days of the invoice date.</p>
  <p>Reach out if you have any questions regarding the charges listed.</p>
`,
    signature: { lines: ["Regards,", "Customs Brokerage Co.", "Accounts Receivable"] }
  },
  {
    id: 9, initials: "CB", color: "#6b7280", name: "Customs Brokerage Co.", email: "billing@customsbrokerageco.com",
    to: "search@outlook.com", time: "Jun 10", fullTime: "June 10, 1:05 PM",
    subject: "Invoice #INV-20240612 Attached", fullSubject: "Invoice #INV-20240612 Attached",
    preview: "Please find attached invoice for custo...", unread: false,
    bodyHtml: `
  <p>Dear Client,</p>
  <p>Please find attached invoice for customs clearance and duty processing fees related to your latest cross-border shipment.</p>
  <p>Kindly confirm receipt at your convenience.</p>
`,
    signature: { lines: ["Regards,", "Customs Brokerage Co.", "Accounts Receivable"] }
  },
  {
    id: 10, initials: "CB", color: "#6b7280", name: "Customs Brokerage Co.", email: "billing@customsbrokerageco.com",
    to: "search@outlook.com", time: "Jun 10", fullTime: "June 10, 10:40 AM",
    subject: "Invoice #INV-20240612 Attached", fullSubject: "Invoice #INV-20240612 Attached",
    preview: "Please find attached invoice for custo...", unread: false,
    bodyHtml: `
  <p>Dear Client,</p>
  <p>Please find attached invoice for custodial handling and warehousing charges incurred during the clearance process.</p>
  <p>Let us know if you need an itemized breakdown.</p>
`,
    signature: { lines: ["Regards,", "Customs Brokerage Co.", "Accounts Receivable"] }
  }
];
