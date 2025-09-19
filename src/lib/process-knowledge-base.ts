/**
 * Process Knowledge Base Documents
 * Ingests the parsed B Corp documents into the knowledge base
 */

import { processBCorpStandards } from './knowledge-base-processor';

// Map of parsed documents from the tool results
const parsedDocuments: Record<string, string> = {
  'all-2.pdf': `# Document parsed from: all-2.pdf

## Page 1

B Lab Standards

Body of Knowledge (BoK)

B Lab Standards V2.1 ©B Lab Company August 12, 2025

## Page 2

Table of Contents

Introduction                                     3
Foundation Requirements (FR)                     7
Purpose & Stakeholder Governance (PSG)            143
Fair Work (FW)                                    285
Justice, Equity, Diversity & Inclusion (JEDI)     403
Human Rights (HR)                                 536
Climate Action (CA)                               746
Environmental Stewardship & Circularity (ESC)     852
Government Affairs & Collective Action (GACA)    1146

## Page 3

Introduction

As the climate crisis intensifies and societal inequality grows, the need to bring about systemic change is clear. That's why B Lab has strengthened its standards for business impact, equipping companies to drive meaningful, sustainable change.

B Lab has continuously evolved its certification standards to raise the bar for responsible business. The latest updates provide greater clarity and consistency, ensuring companies focus on the most impactful business actions. These standards establish a stronger, more transparent foundation for all businesses committed to building an inclusive, equitable, and regenerative global economy.

Join us in embracing the B Lab Standards and unlock your company's true potential as a catalyst for systemic change!

Overview of the B Lab Standards

Under the B Lab Standards, your company needs to meet:
•  Foundation Requirements which make sure your company is eligible to pursue certification and includes a risk assessment.
•  Impact Topic Requirements which cover social, environmental, and governance impact in seven areas. They're tailored to your company's size, sector, industry.

Foundation Requirements
In a company's certification journey, its first step is meeting the Foundation Requirements. This sequencing ensures companies are meeting fundamental eligibility requirements and engage in a risk assessment before they progress to the Impact Topic requirements.
The Foundation Requirements require a company to:
•  Eligibility Requirements: be legally incorporated, comply with local and national laws, and not be materially involved in industries that undermine B Lab's Theory of Change.
•  Stakeholder Governance: adopt the B Corp Legal Requirement, which ensures accountability to all stakeholders, and sign the B Corp Declaration of Interdependence.

•  Risk Assessment: create a risk profile using B Lab's risk profile tool (for company sizes small and above). This process determines the number of potential additional due-diligence sub-requirements that the company must meet for B Corp certification.

Impact Topic Requirements
Next, the company is required to meet and continuously improve upon performance requirements that focus on its operations, value chain, and stakeholders across seven environmental, social, and governance impact areas.
The Impact Requirements require a company to:
•  Purpose and Stakeholder Governance: act in accordance with a defined purpose and embed stakeholder governance in decision making. By doing so, they contribute to an inclusive, equitable, and regenerative economic system for all people and the planet.
•  Fair Work: provide good quality jobs and have positive workplace cultures.
•  Justice, Equity, Diversity, & Inclusion (JEDI): have inclusive and diverse workplaces and contribute to just and equitable communities.
•  Human Rights: treat people with dignity and respect their human rights.
•  Climate Action: take action to combat the climate crisis and its impacts.
•  Environmental Stewardship and Circularity: demonstrate environmental stewardship and contribute to the circular economy in their operations and value chain. They both minimize negative impacts, to help stay within ecological thresholds, and pursue positive impacts.
•  Government Affairs & Collective Action: engage in collective action and government affairs to drive positive systemic change.

The B Lab Standards framework ensures companies aren't just measuring their impact, but actively working to improve it across all these critical areas.`,

  'ImpactAssessmentSupportContext-2.pdf': `# Document parsed from: ImpactAssessmentSupportContext-2.pdf

## Page 1

What to know about scoping your company for certification

This article contains the rules and requirements for defining a company's scope for B Corp Certification on B Lab's new standards. The scope determines if a company with a complex structure, including multiple legal entities, facilities and operations, can be certified under a single certification and single assessment.

The scoping rules are as follows:

1. The B Corp Certification scope must include all the following that are owned/controlled* by the applicant company, and which the company seeks to apply the B Corp Certification claim:

  • Legal entities
  • Facilities  
  • Business activities and operations

*Definition: Control means having authority over an entity's leadership or being directly involved in its daily operations and decision-making, including the ability to direct or manage its business activities.

If a legal entity is included in the scope of certification, it is required that all facilities/employees/revenue/business operations that exist under that legal entity are considered within scope of the assessment and certification.

Control can be exercised in several ways. If a legal entity meets either of the control criteria listed below, it must be included in the scope:

1.a Subsidiaries that are financially consolidated and/or controlled

The applicant company must include all subsidiaries within its certification scope if:
• The subsidiary is financially consolidated in the applicant's accounts; or
• The applicant company exercises control over the subsidiary's operations, whether or not it is financially consolidated.

1.b Affiliated entities that are controlled through executive management of the entity

Affiliated entities are legal entities linked through common ownership, branding, joint ventures, or shared operations. If the applicant company exercises control over such entities, they must be included in the Certification Scope.`,

  'LTD_Research-2.pdf': `# Document parsed from: LTD_Research-2.pdf

## Page 1

B Corp Certification Requirements for UK Limited Companies (LTD)

1. Legal Requirements: Amending Articles and Section 172 Duties

Mission-Lock in the Articles: Every UK LTD seeking B Corp Certification must amend its Articles of Association to embed a stakeholder-oriented purpose and duties. B Lab UK provides prescribed wording (to be adopted verbatim) that expands directors' duties under the Companies Act 2006 Section 172.

In practical terms, the company's objects clause is broadened to include a commitment to create a "material positive impact on society and the environment", alongside the traditional goal of promoting the success of the company for shareholders. Additionally, the Articles impose a duty on directors to consider the interests of all stakeholders – not just shareholders – when making decisions (e.g. employees, suppliers, community, and the environment).

This legal "mission lock" empowers and obligates directors to balance profit with purpose, ensuring stakeholder interests are factored into board decisions going forward. It also helps protect the company's mission through future capital raises or leadership changes by making those commitments part of the company's constitution.

Special Resolution and Filing: Implementing the legal requirement involves a formal alteration of the Articles. The board must approve the changes and then obtain shareholder approval via a special resolution (75% majority) to amend the Articles. For private companies this can be done by written resolution; public or larger companies may convene a general meeting for the vote.

Once passed, the company must file the updated Articles, the special resolution, and a Companies House form (e.g. form CC04) with the Registrar within 15 days.

Timing for Legal Change: For smaller companies, B Lab requires the legal amendment before final certification. UK businesses with 0–49 employees must complete the Article change during the certification process (typically before approval). Larger companies are given a bit more leeway: if an LTD has ≥50 employees, B Lab UK permits up to 12 months after certification to finalize the legal change.`,

  'Step_2_Improve_your_Score-2.pdf': `# Document parsed from: Step_2_Improve_your_Score-2.pdf

## Page 2

The B Corp Certification Process

In order to progress with B Corp Certification, your company must first score 80+ points on the B Impact Assessment - the free, online platform used by B Lab to verify performance across 5 key areas of Governance, Workers, Community, Environment & Customers.

Meeting 80 points doesn't usually happen after your initial pass at the assessment but improving your company's impact is made easier thanks to a range of tools and resources built into the BIA.

## Page 3

Tools and resources for improving your score

If you're working to cross the 80-point threshold or want to improve your business's impact in certain areas, there are plenty of useful tools and resources built into the BIA to support companies of all sectors and sizes.

These include best practice guides, case studies and other dynamic tools designed to help you create an improvement roadmap, set goals for improved performance and track your performance over time:

Bookmark Report - Highlight questions on the assessment you wish to revisit by clicking the bookmark icon in the upper right corner of a question.

Customised Improvement Report - Once you have completed the assessment, a report is generated automatically that identifies the key questions you could be performing better on to improve your current score.

Learn more - On many of the questions within the assessment, you will find a useful 'Learn' button which provides you with further explanations, definitions and real-world examples, designed to support your improvement.

## Page 4

Tips to improve your impact (and your score!)

As you set out to improve your BIA score, a good starting point is to formalise your company policies and track impact metrics across the 5 impact areas measured in the assessment. For example:

Governance - Sharing financial information with employees
Workers - Providing professional development opportunities  
Community - Supporting local suppliers and community organizations
Environment - Monitoring and reducing energy consumption
Customers - Ensuring product quality and customer satisfaction`,

  'Updated_stakeholder_governance_guide_APRILpdf-2.pdf': `# Document parsed from: Updated_stakeholder_governance_guide_APRILpdf-2.pdf

## Page 1

Embracing Stakeholder Governance

A Guide to Meeting the B Corp Legal Requirement for Boards and Investors

## Page 2

Contents

1. What is a B Corp?
2. Why companies are becoming B Corps?
3. Meeting the B Corp Legal Requirement
4. Implementing the B Corp Legal Requirement
5. How the UK's first listed B Corp embraced stakeholder governance
6. Join the Better Business Act

Certified B Corporations not only meet high standards of social and environmental performance in their daily operations but they are also required to embed stakeholder interests into their governance model through meeting the B Corp Legal Requirement.

## Page 3

What is a B Corp?

Certified B Corporations, or B Corps, are companies verified to meet high standards of social and environmental performance, transparency and accountability.

Our most challenging global problems cannot be solved by governments and charities alone. By harnessing the power of business, B Corps commit to positively impact all stakeholders – workers, communities, customers, and our planet.

To achieve and maintain certification, all B Corps:
1. Complete the B Impact Assessment and achieve a verified score of 80+ points, recertifying every 3 years.
2. Meet the B Corp Legal Requirement, amending their constitutional documents to commit to consider the impact of their decisions on all stakeholders, not just shareholders.
3. Sign the Declaration of Interdependence and publicly list their impact score on the B Lab Directory.`,

  'Step_3_Meet_the_B_Corp_legal_requirement-2.pdf': `# Document parsed from: Step_3_Meet_the_B_Corp_legal_requirement-2.pdf

## Page 2

The B Corp Certification Process

In addition to measuring and managing your impact through the B Impact Assessment, B Corps are also required to make a legal change in order to complete certification.

This legal change is a commitment to consider the impact of decisions on your company's stakeholders now and in the future by building this consideration into your constitutional documents.

## Page 3

What is the B Corp Legal Requirement?

The B Corp Legal Requirement varies across countries but companies based in the UK are required to make an amendment to their constitutional documents commiting to use business as a force for good, by:

Creating a material positive impact on society and the environment through your business and operations

Considering all 'stakeholder interests' when making decisions - including your shareholders, employees, suppliers, society and the environment

The approved language that limited companies use to amend their Articles of Association must be adopted verbatim and can be found here. In this document, you will find that this legal language has also been adapted to other company forms such as Limited Liability Partnerships, Companies Limited by Guarantee and Community Interest Companies.

The UK B Corp Legal Requirement has been developed by the Policy Council of B Lab after reviewing and taking into account the B Corp Legal Requirement in the US and the statutory framework for directors' duties under s172 of the Companies Act 2006 in the UK.

## Page 4

Why is this a requirement?

The B Corp Legal Requirement formalises your company's alignment with the B Corp Movement's values and embeds a stakeholder-focused mindset that separates B Corps from other businesses.

It differentiates B Corps from other businesses by adding a layer of legal protection to the purpose of the company. It also protects the mission of the company through capital raises and leadership changes.`,

  'UK_B_Corp_Legal_Requirement_2024-2.pdf': `# Document parsed from: UK_B_Corp_Legal_Requirement_2024-2.pdf

## Page 1

The 'Legal Requirement' for a B Corp in the UK — An Explanation

Contents
1. Introduction
2. The UK Legal Requirement Language  
3. Explanation of the UK Legal Requirement Language
4. Process for Adopting the UK Legal Requirement
5. Different Legal Forms

## Page 2

1. Introduction

The language of the Legal Requirement for B Corps in the UK (the "UK Legal Requirement") and the accompanying guidance in this document were originally developed by B Lab UK in July 2015, in collaboration with senior lawyers and other experts in purpose-driven business and investment.

In developing the UK Legal Requirement, B Lab UK considered the B Corp Legal Requirement used in the US, the statutory framework for directors' duties under s172 of the Companies Act 2006 in the UK (the "Companies Act s172 Framework"), and the articles of association of existing UK-incorporated B Corps.

The UK Legal Requirement is a fundamental part of becoming a B Corp. All prospective B Corps must amend their constitutional documents to include a commitment to a 'triple bottom line' approach to business, in the agreed form. The UK Legal Requirement is designed to have wide applicability and be used by all prospective B Corps.

2. The UK Legal Requirement Language

This is the standard wording that all companies limited by shares must adopt into their constitutions (the articles of association) as part of meeting the requirements for B Corp certification.

When drafting the UK Legal Requirement into the business' constitution, it is common practice to insert the wording near the start of the document. The B Corp purposes in paragraph (1), below, are the purposes for which the company exists and are fundamental to the business' approach to governance.`
};

/**
 * Ingest all B Corp documents into the knowledge base
 */
export async function ingestBCorpDocuments(): Promise<void> {
  console.log('Starting B Corp knowledge base ingestion...');
  
  const documentsToProcess = Object.entries(parsedDocuments).map(([filename, content]) => ({
    filename,
    content
  }));
  
  await processBCorpStandards(documentsToProcess);
  
  console.log(`Successfully ingested ${documentsToProcess.length} B Corp documents into knowledge base`);
}