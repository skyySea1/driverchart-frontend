# Requirements Document

## Introduction

A Single Page Application (SPA) for Charter Bus companies to manage documentation and compliance with US DOT (Department of Transportation) and FMCSA regulations. The system provides comprehensive driver qualification file management, fleet maintenance tracking, document registry, and compliance reporting capabilities.

## Glossary

- **Charter_Bus_System**: The complete SPA application for compliance management
- **Driver_Qualification_File**: Digital record containing all required documentation for a commercial driver per FMCSA regulations
- **CDL**: Commercial Driver's License required for operating commercial vehicles
- **MEC**: Medical Examiner's Certificate required for commercial drivers
- **MVR**: Motor Vehicle Record showing driving history
- **Clearinghouse**: FMCSA Drug and Alcohol Clearinghouse database
- **Road_Test_Certificate**: Official DOT 49 CFR 391.31 certificate for driver road testing
- **Fleet_Vehicle**: Commercial bus in the company fleet requiring DOT compliance
- **Document_Registry**: Centralized audit log of all document uploads and changes
- **Compliance_Matrix**: Summary view of all regulatory requirements status by driver
- **Firebase_Auth**: Authentication service for user management
- **Firestore**: NoSQL database for storing application data

## Requirements

### Requirement 1

**User Story:** As a fleet manager, I want a responsive dashboard interface, so that I can access compliance information from any device.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL display a collapsible dark sidebar (slate-900) on the left side
2. WHEN the collapse button is clicked, THE Charter_Bus_System SHALL toggle the sidebar visibility with arrow icons indicating the action
3. WHEN accessed on mobile devices, THE Charter_Bus_System SHALL display a hamburger menu for navigation
4. THE Charter_Bus_System SHALL maintain a clean, professional design using Tailwind CSS
5. THE Charter_Bus_System SHALL use Lucide-vue-next icons throughout the interface

### Requirement 2

**User Story:** As a compliance officer, I want to view key performance indicators on a dashboard, so that I can quickly assess fleet compliance status.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL display KPI cards showing Total Drivers, Total Vehicles, Compliance Alerts, and Audit Score
2. THE Charter_Bus_System SHALL show automatic alerts for items expiring within 30 days
3. THE Charter_Bus_System SHALL display expired items in red, items expiring in 30 days in yellow, and valid items in green
4. THE Charter_Bus_System SHALL include a DOT Regulation Assistant widget for regulatory questions
5. THE Charter_Bus_System SHALL provide an AI Risk Audit button for individual driver analysis

### Requirement 3

**User Story:** As a fleet manager, I want to manage driver qualification files, so that I can maintain FMCSA compliance for all drivers.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL display a driver table with columns for Name, Status, Contact, CDL Exp, Medical Exp, Annual Review, Clearinghouse Review, and Actions
2. WHEN creating or editing a driver, THE Charter_Bus_System SHALL provide fields for personal data, employment information, and compliance documentation
3. THE Charter_Bus_System SHALL concatenate First Name, Middle Name, and Last Name for search functionality
4. THE Charter_Bus_System SHALL provide standardized upload functionality for CDL, Medical Certificate, MVR, Drug & Alcohol records, and Road Test certificates
5. WHEN a document is uploaded, THE Charter_Bus_System SHALL change the upload button icon to green to indicate file presence

### Requirement 4

**User Story:** As a compliance officer, I want to generate and print Road Test certificates, so that I can provide official DOT documentation.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL provide printer and download icons in the Road Test section
2. WHEN the printer icon is clicked, THE Charter_Bus_System SHALL open a modal with a pre-filled DOT 49 CFR 391.31 certificate template
3. THE Charter_Bus_System SHALL populate the certificate with driver data automatically
4. WHEN printing, THE Charter_Bus_System SHALL hide sidebar and modals using CSS print classes
5. THE Charter_Bus_System SHALL allow saving the certificate as PDF

### Requirement 5

**User Story:** As a fleet manager, I want to delete driver records safely, so that I can maintain data integrity while removing outdated information.

#### Acceptance Criteria

1. WHEN the delete button is clicked, THE Charter_Bus_System SHALL display a double confirmation modal
2. THE Charter_Bus_System SHALL use red alert styling for the confirmation dialog
3. THE Charter_Bus_System SHALL require explicit confirmation before permanent deletion
4. WHEN a driver is terminated, THE Charter_Bus_System SHALL update their status to "Terminated" when dismissal date is entered
5. THE Charter_Bus_System SHALL maintain data integrity during deletion operations

### Requirement 6

**User Story:** As a maintenance supervisor, I want to track fleet vehicle compliance, so that I can ensure all buses meet DOT inspection requirements.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL display a fleet table with Bus Number, VIN, Status, Last Annual Inspection, Next Inspection, and Mileage
2. THE Charter_Bus_System SHALL automatically calculate next inspection date as last inspection date plus one year
3. THE Charter_Bus_System SHALL provide upload functionality for inspection reports
4. THE Charter_Bus_System SHALL apply the same color coding system for inspection dates as driver documents
5. THE Charter_Bus_System SHALL store vehicle data in the vehicles collection

### Requirement 7

**User Story:** As an auditor, I want a centralized document registry, so that I can track all document changes and uploads for compliance auditing.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL maintain a Document Registry with sub-tabs for General History, Driver Docs, and Fleet Docs
2. THE Charter_Bus_System SHALL provide search filters specific to each tab (by driver name or bus number)
3. THE Charter_Bus_System SHALL display audit information including Upload Date, File Name, Type, Related Entity, and User
4. WHEN any document is uploaded or modified, THE Charter_Bus_System SHALL automatically create a log entry in the document_logs collection
5. THE Charter_Bus_System SHALL maintain real-time updates of document changes

### Requirement 8

**User Story:** As a compliance manager, I want comprehensive reporting capabilities, so that I can generate audit reports and track compliance trends.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL provide a Compliance Matrix showing all regulatory requirements status by driver
2. THE Charter_Bus_System SHALL generate an Expiration Forecast for items expiring within 90 days
3. THE Charter_Bus_System SHALL create a Missing Documentation Audit for active drivers/vehicles without required files
4. THE Charter_Bus_System SHALL provide a Fleet Readiness report summarizing vehicle inspection status
5. THE Charter_Bus_System SHALL update all reports in real-time as data changes

### Requirement 9

**User Story:** As a system user, I want secure and reliable data access, so that I can trust the system with sensitive compliance information.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL initialize Firebase authentication before any database calls
2. THE Charter_Bus_System SHALL use anonymous authentication or custom tokens for access
3. THE Charter_Bus_System SHALL store data in structured Firestore collections: drivers, vehicles, and document_logs
4. THE Charter_Bus_System SHALL use onSnapshot for real-time data updates
5. THE Charter_Bus_System SHALL simulate file uploads by storing filename strings in the database

### Requirement 10

**User Story:** As a fleet manager, I want AI-powered compliance assistance, so that I can get instant guidance on regulatory requirements and risk assessment.

#### Acceptance Criteria

1. THE Charter_Bus_System SHALL provide a DOT Regulation Assistant widget that answers regulatory questions
2. WHEN a user asks about FMCSA regulations, THE Charter_Bus_System SHALL provide accurate responses based on current DOT standards
3. THE Charter_Bus_System SHALL include an AI Risk Audit feature for individual drivers
4. WHEN the AI audit is triggered, THE Charter_Bus_System SHALL analyze driver data and generate risk reports with actionable recommendations
5. THE Charter_Bus_System SHALL present AI insights in an easily understandable format for management decisions