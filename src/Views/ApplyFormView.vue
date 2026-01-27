<!-- src/Views/PublicApplicationForm.vue -->

<template>
  <AnimatedBody>
    <!-- Application Card -->
    <div
      class="app-card bg-white rounded-2xl shadow-2xl w-full overflow-hidden z-10 flex flex-col transition-all duration-500 ease-in-out"
      :class="
        currentStep === 6 ||
        currentStep === 7 ||
        currentStep === 8 ||
        currentStep === 10 ||
        currentStep === 11
          ? 'max-w-3xl'
          : 'max-w-md'
      "
    >
      <div class="bg-slate-900 p-6 text-center shrink-0">
        <div class="flex flex-col items-center gap-3">
          <div class="flex items-center gap-3">
            <Bus class="w-8 h-8 text-blue-400 shrink-0" />
            <h1 class="text-2xl font-bold text-white">PhoenixBus</h1>
          </div>

          <div class="space-y-0.5">
            <h2 class="text-xl font-bold text-indigo-100">Driver Application</h2>
            <p class="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">
              Join our professional team
            </p>
          </div>
        </div>
      </div>

      <!-- Progress Section -->
      <div v-if="!submitted" class="px-8 pt-6 pb-2 shrink-0">
        <div
          class="flex justify-between items-end text-xs font-bold uppercase tracking-widest mb-2"
        >
          <span class="text-indigo-600"
            >Step {{ currentStep }} <span class="text-slate-400">/ {{ totalSteps }}</span></span
          >
          <span class="text-slate-500">{{ currentStepName }}</span>
        </div>
        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-linear-to-r from-indigo-500 to-blue-500 transition-all duration-500 ease-out"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <div class="p-8 flex-1 flex flex-col">
        <div
          v-if="submitted"
          class="text-center py-8 my-auto animate-in fade-in zoom-in duration-500"
        >
          <div
            class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6"
          >
            <Check class="w-8 h-8 text-green-600" />
          </div>

          <h2 class="text-2xl font-bold text-slate-800">Application Received!</h2>

          <p class="text-slate-600 mt-4 leading-relaxed">
            Thank you for applying to <strong>CharterSafe</strong>. Our compliance team will review
            your information and contact you shortly.
          </p>

          <button
            @click="reset"
            class="mt-8 px-6 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
          >
            Submit Another Application
          </button>
        </div>

        <form v-else @submit.prevent="handleNextOrSubmit" class="flex flex-col h-full">
          <Transition name="slide-fade" mode="out-in">
            <!-- Step 1: Personal Info -->
            <div v-if="currentStep === 1" class="space-y-4 flex-1">
              <div class="grid grid-cols-2 gap-4">
                <InputGroup
                  v-model="form.personalInfo.firstName"
                  label="First Name"
                  required
                  placeholder="John"
                  :error="errors['personalInfo.firstName']"
                />
                <InputGroup
                  v-model="form.personalInfo.lastName"
                  label="Last Name"
                  required
                  placeholder="Doe"
                  :error="errors['personalInfo.lastName']"
                />
              </div>

              <InputGroup
                v-model="form.personalInfo.middleName"
                label="Middle Name"
                placeholder="Optional"
                :error="errors['personalInfo.middleName']"
              />

              <InputGroup
                v-model="form.personalInfo.dob"
                label="Date of Birth"
                type="date"
                required
                :error="errors['personalInfo.dob']"
              />

              <InputGroup
                v-model="form.personalInfo.ssnNumber"
                label="Social Security Number"
                placeholder="123-45-6789"
                required
                maxlength="11"
                isSSN
                :error="errors['personalInfo.ssnNumber']"
              />

              <InputGroup
                v-model="form.personalInfo.medicalExpirationDate"
                label="Medical Expiration Date"
                placeholder="MM/DD/YYYY"
                type="date"
                required
                :error="errors['personalInfo.medicalExpirationDate']"
              />

              <InputGroup
                v-model="form.personalInfo.email"
                label="Email Address"
                type="email"
                required
                placeholder="john.doe@example.com"
                :error="errors['personalInfo.email']"
              />

              <InputGroup
                v-model="form.personalInfo.phone"
                label="Phone Number"
                type="tel"
                required
                placeholder="(555) 000-0000"
                :error="errors['personalInfo.phone']"
              />
            </div>

            <!-- Step 2: Address History (Last 3 Years) -->
            <div v-else-if="currentStep === 2" class="space-y-4 flex-1 overflow-y-auto max-h-96">
              <div class="space-y-1 mb-4">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                  Address History (Last 3 Years)
                </h3>
                <p class="text-xs text-slate-500">
                  List all addresses where you lived in the past 3 years
                </p>
              </div>

              <div
                v-for="(address, index) in form.addresses"
                :key="index"
                class="p-4 border border-slate-200 rounded-lg space-y-3 relative"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-slate-600">Address {{ index + 1 }}</span>
                  <button
                    v-if="form.addresses.length > 1"
                    @click="removeAddress(index)"
                    type="button"
                    class="text-red-500 text-xs hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <InputGroup
                  v-model="address.street"
                  label="Street Address"
                  required
                  placeholder="123 Main St, Apt 4B"
                  :error="errors[`addresses.${index}.street`]"
                />

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup
                    v-model="address.city"
                    label="City"
                    required
                    placeholder="Orlando"
                    :error="errors[`addresses.${index}.city`]"
                  />
                  <InputGroup
                    v-model="address.state"
                    label="State"
                    required
                    placeholder="FL"
                    :error="errors[`addresses.${index}.state`]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup
                    v-model="address.fromDate"
                    label="From"
                    type="date"
                    required
                    :error="errors[`addresses.${index}.fromDate`]"
                  />
                  <InputGroup
                    v-model="address.toDate"
                    :checkboxValue="address.present || false"
                    @update:checkboxValue="address.present = $event"
                    :isEnabled="!address.present"
                    checkboxTitle="Present"
                    enableCheck
                    toggleTitle="Mark if this is your current address"
                    label="To"
                    type="date"
                    placeholder="Current"
                    :error="errors[`addresses.${index}.toDate`]"
                  />
                </div>
                <InputGroup
                  v-model="address.zip"
                  label="ZIP"
                  required
                  placeholder="32801"
                  :error="errors[`addresses.${index}.zip`]"
                />
              </div>

              <button
                @click="addAddress"
                type="button"
                class="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-semibold"
              >
                + Add Another Address
              </button>
            </div>

            <!-- Step 3: License Data -->
            <div v-else-if="currentStep === 3" class="space-y-4 flex-1 overflow-y-auto max-h-96">
              <div class="space-y-1 mb-4">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                  Driver's License Information
                </h3>
                <p class="text-xs text-slate-500">
                  List all licenses with numbers, classes, and restrictions
                </p>
              </div>

              <BaseAlert
                type="warning"
                message="Failure to enter accurate license information may result in non-consideration and a rejected application!"
              />

              <div
                v-for="(license, index) in form.licenses"
                :key="index"
                class="p-4 border border-slate-200 rounded-lg space-y-3 relative"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold text-slate-600">License {{ index + 1 }}</span>
                  <button
                    v-if="form.licenses.length > 1"
                    @click="removeLicense(index)"
                    type="button"
                    class="text-red-500 text-xs hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup
                    v-model="license.number"
                    label="License Number"
                    required
                    placeholder="A123-456-789"
                    :error="errors[`licenses.${index}.number`]"
                  />
                  <InputGroup
                    v-model="license.state"
                    label="State"
                    required
                    placeholder="FL"
                    :error="errors[`licenses.${index}.state`]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup
                    v-model="license.class"
                    label="Class"
                    required
                    placeholder="A, B, C"
                    :error="errors[`licenses.${index}.class`]"
                  />
                  <InputGroup
                    v-model="license.endorsements"
                    type=""
                    label="Endorsements"
                    placeholder="P, S, N"
                    :error="errors[`licenses.${index}.endorsements`]"
                  />
                  <InputGroup
                    v-model="license.emissionDate"
                    label="Emission Date"
                    type="date"
                    required
                    :error="errors[`licenses.${index}.emissionDate`]"
                  />
                  <InputGroup
                    v-model="license.expirationDate"
                    label="Expiration"
                    type="date"
                    required
                    :error="errors[`licenses.${index}.expirationDate`]"
                  />
                </div>

                <InputGroup
                  v-model="license.restrictions"
                  label="Restrictions"
                  placeholder="None, or list restrictions"
                  :error="errors[`licenses.${index}.restrictions`]"
                />
              </div>

              <button
                @click="addLicense"
                type="button"
                class="w-full py-2 border-2 cursor-pointer border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-semibold"
              >
                + Add Another License
              </button>
            </div>

            <!-- Step 4: Driving Experience -->
            <div v-else-if="currentStep === 4" class="space-y-4 flex-1">
              <div class="space-y-1 mb-4">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                  Driving Experience
                </h3>
                <p class="text-xs text-slate-500">Provide details about your driving background</p>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter">
                  Years of Experience
                </label>
                <input
                  v-model.number="form.experienceYears"
                  type="number"
                  min="0"
                  required
                  class="input-base w-full"
                  :class="{
                    'border-red-500 focus:border-red-500 focus:ring-red-200':
                      errors['experienceYears'],
                  }"
                />
                <p
                  v-if="errors['experienceYears']"
                  class="text-[10px] text-red-500 font-semibold mt-1 animate-pulse"
                >
                  {{ errors['experienceYears'] }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter">
                  Vehicle Types (Select all that apply)
                </label>
                <div class="space-y-2">
                  <div
                    v-for="vehicleType in VEHICLE_TYPES as VehicleTypes[]"
                    :key="vehicleType"
                    class="flex flex-col gap-2 p-3 border border-slate-100 rounded-lg bg-slate-50/50"
                  >
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="isVehicleSelected(vehicleType)"
                        @change="
                          toggleVehicleType(
                            vehicleType,
                            ($event.target as HTMLInputElement).checked,
                          )
                        "
                        class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span class="font-medium text-slate-700">{{ vehicleType }}</span>
                    </label>

                    <div
                      v-if="isVehicleSelected(vehicleType)"
                      class="ml-6 animate-in fade-in slide-in-from-top-1 duration-200"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Driver License Upload Section -->
              <div class="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div class="space-y-1">
                  <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    Upload Florida Driver License: {{ form.licenses[0]?.number || '32065516205' }}
                  </h3>
                  <p class="text-xs text-slate-500">
                    Please upload a copy of the drivers license specified above. (Supported Formats:
                    .jpg, .png, .gif)
                  </p>
                </div>

                <FileInput
                  label="Please upload the FRONT copy of your drivers license."
                  v-model:fileName="licenseFrontName"
                  @change="handleLicenseFrontUpload"
                />

                <FileInput
                  label="Please upload the BACK copy of your drivers license."
                  v-model:fileName="licenseBackName"
                  @change="handleLicenseBackUpload"
                />
              </div>

              <!-- Medical Card Upload Section -->
              <div class="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div class="space-y-1">
                  <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    Upload Medical Card Copy
                  </h3>
                  <p class="text-xs text-slate-500">
                    Please scan and upload a copy of your medical card. (Supported Formats: .jpg,
                    .png, .gif)
                  </p>
                </div>

                <FileInput
                  label="Please select the file(s) to upload."
                  v-model:fileName="medicalCardName"
                  @change="handleMedicalCardUpload"
                />
              </div>
            </div>

            <!-- Step 5: Accidents & Violations (Last 3 Years) -->
            <div v-else-if="currentStep === 5" class="space-y-4 flex-1 overflow-y-auto max-h-96">
              <div class="space-y-1 mb-4">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                  Accident & Violation History
                </h3>
                <p class="text-xs text-slate-500">
                  List all accidents and traffic violations in the last 3 years (excluding parking)
                </p>
              </div>

              <!-- Accidents Section -->
              <div class="space-y-3">
                <h4 class="text-xs font-bold text-slate-600 uppercase">Accidents</h4>

                <div
                  v-if="form.accidents.length === 0"
                  class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded"
                >
                  No accidents to report? Click "Add Accident" if you have any to report.
                </div>

                <div
                  v-for="(accident, index) in form.accidents"
                  :key="'accident-' + index"
                  class="p-3 border border-slate-200 rounded-lg space-y-2 bg-red-50/30"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-semibold text-slate-600"
                      >Accident {{ index + 1 }}</span
                    >
                    <button
                      @click="removeAccident(index)"
                      type="button"
                      class="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <InputGroup
                      v-model="accident.date"
                      label="Date"
                      type="date"
                      required
                      :error="errors[`accidents.${index}.date`]"
                    />
                    <InputGroup
                      v-model="accident.location"
                      label="Location"
                      required
                      placeholder="City, State"
                      :error="errors[`accidents.${index}.location`]"
                    />
                  </div>

                  <InputGroup
                    v-model="accident.description"
                    label="Description"
                    required
                    placeholder="Brief description of the accident"
                    :error="errors[`accidents.${index}.description`]"
                  />

                  <div class="flex gap-4 text-xs">
                    <label class="flex items-center gap-1">
                      <input
                        type="checkbox"
                        v-model="accident.injuries"
                        class="rounded border-slate-300"
                      />
                      <span>Injuries?</span>
                    </label>
                    <label class="flex items-center gap-1">
                      <input
                        type="checkbox"
                        v-model="accident.fatalities"
                        class="rounded border-slate-300"
                      />
                      <span>Fatalities?</span>
                    </label>
                  </div>
                </div>

                <button
                  @click="addAccident"
                  type="button"
                  class="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-red-400 hover:text-red-600 transition-colors text-sm font-semibold"
                >
                  + Add Accident
                </button>
              </div>

              <!-- Violations Section -->
              <div class="space-y-3 mt-6">
                <h4 class="text-xs font-bold text-slate-600 uppercase">Traffic Violations</h4>

                <div
                  v-if="form.violations.length === 0"
                  class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded"
                >
                  No violations to report? Click "Add Violation" if you have any to report.
                </div>

                <div
                  v-for="(violation, index) in form.violations"
                  :key="'violation-' + index"
                  class="p-3 border border-slate-200 rounded-lg space-y-2 bg-orange-50/30"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-semibold text-slate-600"
                      >Violation {{ index + 1 }}</span
                    >
                    <button
                      @click="removeViolation(index)"
                      type="button"
                      class="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <InputGroup
                      v-model="violation.date"
                      label="Date"
                      type="date"
                      required
                      :error="errors[`violations.${index}.date`]"
                    />
                    <InputGroup
                      v-model="violation.location"
                      label="Location"
                      required
                      placeholder="City, State"
                      :error="errors[`violations.${index}.location`]"
                    />
                  </div>

                  <InputGroup
                    v-model="violation.violation"
                    label="Violation Type"
                    required
                    placeholder="e.g., Speeding, Failure to yield"
                    :error="errors[`violations.${index}.violation`]"
                  />

                  <InputGroup
                    v-model="violation.penalty"
                    label="Penalty/Outcome"
                    placeholder="e.g., Fine, Points, Court date"
                    :error="errors[`violations.${index}.penalty`]"
                  />
                </div>

                <button
                  @click="addViolation"
                  type="button"
                  class="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-orange-400 hover:text-orange-600 transition-colors text-sm font-semibold"
                >
                  + Add Violation
                </button>
              </div>

              <!-- Forfeitures & Legal Questions -->
              <div class="space-y-4 mt-6 border-t border-slate-100 pt-4">
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-700 uppercase"
                    >Forfeitures Previous 3 Years</label
                  >
                  <p class="text-xs font-bold text-slate-500 mb-1">
                    List any forfeitures in the past 3 years.
                  </p>
                  <textarea
                    v-model="form.forfeitures"
                    rows="3"
                    class="input-base w-full resize-none"
                    placeholder="List details here..."
                  ></textarea>
                </div>

                <div class="space-y-3">
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-slate-700">
                      A. Have you ever been denied a license, permit or privilege to operate a motor
                      vehicle?
                    </p>
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2">
                        <input
                          type="radio"
                          v-model="form.deniedLicense"
                          :value="true"
                          class="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="text-sm">Yes</span>
                      </label>
                      <label class="flex items-center gap-2">
                        <input
                          type="radio"
                          v-model="form.deniedLicense"
                          :value="false"
                          class="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <p class="text-sm font-medium text-slate-700">
                      B. Has any license, permit or privilege ever been suspended or revoked?
                    </p>
                    <div class="flex gap-4">
                      <label class="flex items-center gap-2">
                        <input
                          type="radio"
                          v-model="form.suspendedLicense"
                          :value="true"
                          class="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="text-sm">Yes</span>
                      </label>
                      <label class="flex items-center gap-2">
                        <input
                          type="radio"
                          v-model="form.suspendedLicense"
                          :value="false"
                          class="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  <div v-if="form.deniedLicense || form.suspendedLicense" class="space-y-1">
                    <label class="block text-xs font-bold text-slate-700 uppercase"
                      >C. Explanation</label
                    >
                    <p class="text-xs text-slate-500 mb-1">Briefly describe the circumstances.</p>
                    <textarea
                      v-model="form.denialSuspensionExplanation"
                      rows="3"
                      class="input-base w-full resize-none"
                      placeholder="Explanation..."
                      :class="{
                        'border-red-500 focus:border-red-500 focus:ring-red-200':
                          errors['denialSuspensionExplanation'],
                      }"
                    ></textarea>
                    <p
                      v-if="errors['denialSuspensionExplanation']"
                      class="text-[10px] text-red-500 font-semibold mt-1 animate-pulse"
                    >
                      {{ errors['denialSuspensionExplanation'] }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Pre-Employment Employee Alcohol & Drug Test Statement -->
              <div class="space-y-4 mt-6 border-t border-slate-100 pt-6">
                <div class="space-y-2">
                  <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    Pre-Employment Employee Alcohol & Drug Test Statement
                  </h3>
                  <p class="text-xs text-slate-600 leading-relaxed text-justify">
                    49 CFR Part 40.25(j) states, as the employer, you must ask the employee whether
                    he or she has tested positive, or refused to test, on any pre-employment drug or
                    alcohol test administered by an employer to which the employee applied for, but
                    did not obtain, safety-sensitive transportation work covered by DOT agency drug
                    and alcohol testing rules during the past two years. If the employee admits that
                    he or she had a positive test or a refusal to test, you must not use the
                    employee to perform safety-sensitive functions for you, until and unless the
                    employee documents successful completion of the return-to-duty process required
                    in 49 CFR Subpart O.
                  </p>
                </div>

                <div class="space-y-4">
                  <div class="space-y-2">
                    <p class="text-sm font-bold text-slate-700">
                      As the prospective employee, have you:
                    </p>
                    <p class="text-sm text-slate-700">
                      1. Tested positive, or refused to test, on any pre-employment drug or alcohol
                      test administered by an employer to which the employee applied for, but did
                      not obtain, safety-sensitive transportation work covered by DOT agency drug
                      and alcohol testing rules during the past two years.
                    </p>
                    <div class="flex gap-6 mt-2">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          v-model="form.drugTestPositiveOrRefusal"
                          :value="true"
                          class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span class="text-sm font-medium text-slate-700">Yes</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          v-model="form.drugTestPositiveOrRefusal"
                          :value="false"
                          class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span class="text-sm font-medium text-slate-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <p class="text-sm text-slate-700">
                      2. If you answered yes to the above question, can you provide documentation of
                      successful completion of DOT return-to-duty requirements (including follow-up
                      tests).
                    </p>
                    <div class="flex gap-6 mt-2">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          v-model="form.drugTestDocumentation"
                          value="Yes"
                          class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span class="text-sm font-medium text-slate-700">Yes</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          v-model="form.drugTestDocumentation"
                          value="No"
                          class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span class="text-sm font-medium text-slate-700">No</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          v-model="form.drugTestDocumentation"
                          value="N/A"
                          class="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span class="text-sm font-medium text-slate-700">N/A</span>
                      </label>
                    </div>
                    <p
                      v-if="errors['drugTestDocumentation']"
                      class="text-[10px] text-red-500 font-semibold mt-1 animate-pulse"
                    >
                      {{ errors['drugTestDocumentation'] }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mt-6 ml-1 mr-1 mb-2">
                    <InputGroup
                      v-model="form.drugTestSignature"
                      label="Employee Signature"
                      required
                      placeholder="Type your full name"
                      :error="errors['drugTestSignature']"
                    />
                    <InputGroup
                      v-model="form.drugTestDate"
                      label="Date Signed"
                      type="date"
                      required
                      :disabled="true"
                      :error="errors['drugTestDate']"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 6: Employment History -->
            <div v-else-if="currentStep === 6" class="space-y-4 flex-1 overflow-y-auto max-h-96">
              <div class="space-y-1 mb-4">
                <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                  Employment History
                </h3>
                <p class="text-xs text-slate-500">
                  Last 3 years (all jobs) or 10 years (CDL positions)
                </p>
              </div>

              <div
                v-if="form.employmentHistory.length === 0"
                class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded"
              >
                Click "Add Employment" to add your work history.
              </div>

              <div
                v-for="(job, index) in form.employmentHistory"
                :key="'job-' + index"
                class="p-4 border border-slate-200 rounded-lg space-y-3 relative"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-600">Job {{ index + 1 }}</span>
                    <label class="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        v-model="job.wasCdl"
                        class="rounded border-slate-300"
                      />
                      <span class="text-indigo-600 font-semibold">CDL Position</span>
                    </label>
                  </div>
                  <button
                    @click="removeEmployment(index)"
                    type="button"
                    class="text-red-500 text-xs cursor-pointer hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <InputGroup
                  v-model="job.companyName"
                  label="Company Name"
                  required
                  placeholder="ABC Transportation"
                  :error="errors[`employmentHistory.${index}.companyName`]"
                />

                <InputGroup
                  v-model="job.address"
                  label="Company Address"
                  required
                  placeholder="123 Business St"
                  :error="errors[`employmentHistory.${index}.address`]"
                />

                <div class="grid grid-cols-3 gap-2">
                  <InputGroup
                    v-model="job.city"
                    label="City"
                    required
                    placeholder="Orlando"
                    :error="errors[`employmentHistory.${index}.city`]"
                  />
                  <InputGroup
                    v-model="job.state"
                    label="State"
                    required
                    placeholder="FL"
                    :error="errors[`employmentHistory.${index}.state`]"
                  />
                  <InputGroup
                    v-model="job.zip"
                    label="ZIP"
                    required
                    placeholder="32801"
                    :error="errors[`employmentHistory.${index}.zip`]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <InputGroup
                    v-model="job.phone"
                    label="Phone"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    :error="errors[`employmentHistory.${index}.phone`]"
                  />
                  <InputGroup
                    v-model="job.position"
                    label="Position Held"
                    required
                    placeholder="Bus Driver"
                    :error="errors[`employmentHistory.${index}.position`]"
                  />
                </div>

                <InputGroup
                  v-model="job.description"
                  label="Employment Description"
                  placeholder="Describe your duties..."
                  :error="errors[`employmentHistory.${index}.description`]"
                />

                <div class="grid grid-cols-2 gap-2">
                  <InputGroup
                    v-model="job.fromDate"
                    label="From Date"
                    type="date"
                    required
                    :error="errors[`employmentHistory.${index}.fromDate`]"
                  />
                  <InputGroup
                    v-model="job.toDate"
                    :checkboxValue="job.present"
                    @update:checkboxValue="job.present = $event"
                    :isEnabled="!job.present"
                    enableCheck
                    toggleTitle="Check if this is your current job"
                    checkboxTitle="Present"
                    label="To Date"
                    type="date"
                    placeholder="Current"
                    :error="errors[`employmentHistory.${index}.toDate`]"
                  />
                </div>

                <InputGroup
                  v-model="job.reasonForLeaving"
                  label="Reason for Leaving"
                  placeholder="e.g., Career advancement, relocation"
                  :error="errors[`employmentHistory.${index}.reasonForLeaving`]"
                />
              </div>

              <button
                @click="addEmployment"
                type="button"
                class="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-semibold"
              >
                + Add Employment
              </button>
            </div>

            <!-- Step 7: PSP Driver Disclosure & Authorization -->

            <div v-else-if="currentStep === 7" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h3
                    class="text-sm font-bold text-slate-700 uppercase tracking-tighter text-center"
                  >
                    PSP Driver Disclosure & Authorization
                  </h3>

                  <div
                    class="text-[12px] text-slate-600 leading-relaxed text-justify space-y-2 max-h-96 overflow-y-auto pr-2 border border-slate-100 rounded-lg p-3 bg-slate-50/50"
                  >
                    <p class="font-bold text-center">
                      THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY USE BY ALL
                      ACCOUNT HOLDERS
                    </p>

                    <p class="font-bold text-center">
                      IMPORTANT DISCLOSURE REGARDING BACKGROUND REPORTS FROM THE PSP Online Service
                    </p>

                    <p>
                      In connection with your application for employment with
                      <strong>Phoenix Bus Inc</strong>
                      (“Prospective Employer”), Prospective Employer, its employees, agents or
                      contractors may obtain one or more reports regarding your driving, and safety
                      inspection history from the Federal Motor Carrier Safety Administration
                      (FMCSA).
                    </p>

                    <p>
                      When the application for employment is submitted in person, if the Prospective
                      Employer uses any information it obtains from FMCSA in a decision to not hire
                      you or to make any other adverse employment decision regarding you, the
                      Prospective Employer will provide you with a copy of the report upon which its
                      decision was based and a written summary of your rights under the Fair Credit
                      Reporting Act before taking any final adverse action. If any final adverse
                      action is taken against you based upon your driving history or safety report,
                      the Prospective Employer will notify you that the action has been taken and
                      that the action was based in part or in whole on this report.
                    </p>

                    <p>
                      When the application for employment is submitted by mail, telephone, computer,
                      or other similar means, if the Prospective Employer uses any information it
                      obtains from FMCSA in a decision to not hire you or to make any other adverse
                      employment decision regarding you, the Prospective Employer must provide you
                      within three business days of taking adverse action oral, written or
                      electronic notification: that adverse action has been taken based in whole or
                      in part on information obtained from FMCSA; the name, address, and the toll
                      free telephone number of FMCSA; that the FMCSA did not make the decision to
                      take the adverse action and is unable to provide you the specific reasons why
                      the adverse action was taken; and that you may, upon providing proper
                      identification, request a free copy of the report and may dispute with the
                      FMCSA the accuracy or completeness of any information or report. If you
                      request a copy of a driver record from the Prospective Employer who procured
                      the report, then, within 3 business days of receiving your request, together
                      with proper identification, the Prospective Employer must send or provide to
                      you a copy of your report and a summary of your rights under the Fair Credit
                      Reporting Act.
                    </p>

                    <p>
                      Neither the Prospective Employer nor the FMCSA contractor supplying the crash
                      and safety information has the capability to correct any safety data that
                      appears to be incorrect. You may challenge the accuracy of the data by
                      submitting a request to https://dataqs.fmcsa.dot.gov. If you challenge crash
                      or inspection information reported by a State, FMCSA cannot change or correct
                      this data. Your request will be forwarded by the DataQs system to the
                      appropriate State for adjudication.
                    </p>
                    <p>
                      Any crash or inspection in which you were involved will display on your PSP
                      report. Since the PSP report does not report, or assign, or imply fault, it
                      will include all Commercial Motor Vehicle (CMV) crashes where you were a
                      driver or co-driver and where those crashes were reported to FMCSA, regardless
                      of fault. Similarly, all inspections, with or without violations, appear on
                      the PSP report. State citations associated with Federal Motor Carrier Safety
                      Regulations (FMCSR) violations that have been adjudicated by a court of law
                      will also appear, and remain, on a PSP report.
                    </p>

                    <p>
                      The Prospective Employer cannot obtain background reports from FMCSA without
                      your authorization.
                    </p>

                    <p class="font-bold text-center">AUTHORIZATION</p>

                    <p>
                      If you agree that the Prospective Employer may obtain such background reports,
                      please read the following and sign below:
                    </p>

                    <p>
                      I authorize <strong>Phoenix Bus Inc</strong> (“Prospective Employer”) to
                      access the FMCSA Pre-Employment Screening Program (PSP) system to seek
                      information regarding my commercial driving safety record and information
                      regarding my safety inspection history. I understand that I am authorizing the
                      release of safety performance information including crash data from the
                      previous five (5) years and inspection history from the previous three (3)
                      years. I understand and acknowledge that this release of information may
                      assist the Prospective Employer to make a determination regarding my
                      suitability as an employee.
                    </p>

                    <p>
                      I further understand that neither the Prospective Employer nor the FMCSA
                      contractor supplying the crash and safety information has the capability to
                      correct any safety data that appears to be incorrect. I understand I may
                      challenge the accuracy of the data by submitting a request to
                      https://dataqs.fmcsa.dot.gov. If I challenge crash or inspection information
                      reported by a State, FMCSA cannot change or correct this data. I understand my
                      request will be forwarded by the DataQs system to the appropriate State for
                      adjudication.
                    </p>

                    <p>
                      I understand that any crash or inspection in which I was involved will display
                      on my PSP report. Since the PSP report does not report, or assign, or imply
                      fault, I acknowledge it will include all CMV crashes where I was a driver or
                      co-driver and where those crashes were reported to FMCSA, regardless of fault.
                      Similarly, I understand all inspections, with or without violations, will
                      appear on my PSP report, and State citations associated with FMCSR violations
                      that have been adjudicated by a court of law will also appear, and remain, on
                      my PSP report. I have read the above Disclosure Regarding Background Reports
                      provided to me by Prospective Employer and I understand that if I sign this
                      Disclosure and Authorization, Prospective Employer may obtain a report of my
                      crash and inspection history. I hereby authorize Prospective Employer and its
                      employees, authorized agents, and/or affiliates to obtain the information
                      authorized above.
                    </p>

                    <p class="text-[12px] mt-4 text-slate-500">
                      NOTICE: This form is made available to monthly account holders by NIC on
                      behalf of the U.S. Department of Transportation, Federal Motor Carrier Safety
                      Administration (FMCSA). Account holders are required by federal law to obtain
                      an Applicant’s written or electronic consent prior to accessing the
                      Applicant’s PSP report. Further, account holders are required by FMCSA to use
                      the language contained in this Disclosure and Authorization form to obtain an
                      Applicant’s consent. The language must be used in whole, exactly as provided.
                      Further, the language on this form must exist as one stand-alone document. The
                      language may NOT be included with other consent forms or any other language.
                    </p>

                    <p class="text-[12px] text-slate-400">
                      NOTICE: The prospective employment concept referenced in this form
                      contemplates the definition of "employee" contained at 49 C.F.R. 383.5.
                    </p>

                    <p class="text-[12px] text-slate-400">LAST UPDATED 2/11/2016</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <InputGroup
                    :labelClass="currentStep >= 7 ? 'text-[10px]' : 'text-[20px]'"
                    v-model="form.pspDisclosureSignature"
                    label="Prospective Employee Signature"
                    required
                    placeholder="Type your full name"
                    :error="errors['pspDisclosureSignature']"
                  />

                  <InputGroup
                    :labelClass="currentStep >= 7 ? 'text-[10px]' : 'text-[20px]'"
                    v-model="form.pspDisclosureDate"
                    label="Date Signed"
                    type="date"
                    required
                    :disabled="true"
                    :error="errors['pspDisclosureDate']"
                  />
                </div>
              </div>
            </div>

            <!-- Step 8: FMCSA Clearinghouse Consent -->

            <div v-else-if="currentStep === 8" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h3
                    class="text-sm font-bold text-slate-700 uppercase tracking-tighter text-center"
                  >
                    General Consent for Limited Queries of the FMCSA Drug and Alcohol Clearinghouse
                  </h3>

                  <div
                    class="text-[12px] text-slate-600 leading-relaxed text-justify space-y-2 max-h-96 overflow-y-auto pr-2 border border-slate-100 rounded-lg p-3 bg-slate-50/50"
                  >
                    <p>
                      I,
                      <strong
                        >{{ capitalizeName(form.personalInfo.firstName) }}
                        {{ capitalizeName(form.personalInfo.middleName) }}
                        {{ form.personalInfo.lastName }}</strong
                      >, hereby provide consent to <strong>Phoenix Bus Inc</strong> to conduct a
                      limited query of the FMCSA Commercial Driver’s License Drug and Alcohol
                      Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation
                      information about me exists in the Clearinghouse.
                    </p>

                    <p>
                      I am consenting to multiple unlimited queries and for the duration of
                      employment with <strong>Phoenix Bus Inc</strong>.
                    </p>

                    <p>
                      I understand that if the limited query conducted by
                      <strong>Phoenix Bus Inc</strong> indicates that drug or alcohol violation
                      information about me exists in the Clearinghouse, FMCSA will not disclose that
                      information to <strong>Phoenix Bus Inc</strong>
                      without first obtaining additional specific consent from me.
                    </p>

                    <p>
                      I further understand that if I refuse to provide consent for
                      <strong>Phoenix Bus Inc</strong> to conduct a limited query of the
                      Clearinghouse, <strong>Phoenix Bus Inc</strong> must prohibit me from
                      performing safety-sensitive functions, including driving a commercial motor
                      vehicle, as required by FMCSA’s drug and alcohol program regulations.
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <InputGroup
                    v-model="form.fmcsaConsentSignature"
                    label="Employee Signature"
                    required
                    placeholder="Type your full name"
                    :error="errors['fmcsaConsentSignature']"
                  />

                  <InputGroup
                    v-model="form.fmcsaConsentDate"
                    label="Date Signed"
                    type="date"
                    required
                    :disabled="true"
                    :error="errors['fmcsaConsentDate']"
                  />
                </div>
              </div>
            </div>

            <!-- Step 9: Authorization & Release -->
            <div v-else-if="currentStep === 9" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h3 class="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    Authorization & Release
                  </h3>

                  <div
                    class="text-xs text-slate-600 leading-relaxed text-justify space-y-2 max-h-60 overflow-y-auto pr-2 border border-slate-100 rounded-lg p-3 bg-slate-50/50"
                  >
                    <p>
                      I hereby authorize release of information to this prospective employer from my
                      employment file and my Department of Transportation regulated drug and alcohol
                      testing records. This release is in accordance with DOT Regulation 49 CFR
                      Parts 40.25/382.413/391.23. I understand that information to be released, by
                      my previous employer, is limited to the previous three years. You are released
                      from any and all liability which may result from releasing such information.
                      Pursuant to the federal Fair Credit Reporting Act, I hereby authorize this
                      company and its designated agents and representatives to conduct a
                      comprehensive review of my background through any consumer report for
                      employment. I understand that the scope of the consumer report/investigative
                      consumer report may include, but is not limited to, the following areas:
                      verification of Social Security number; current and previous residences;
                      employment history, including all personnel files; education; references;
                      credit history and reports; criminal history, including records from any
                      criminal justice agency in any or all federal, state or county jurisdictions;
                      birth records; motor vehicle records, including traffic citations and
                      registration; and any other public records.
                    </p>

                    <p>
                      I understand that it is my right to review information provided by previous
                      employers; to have errors in the information corrected by the previous
                      employer and for that previous employer to re-send the corrected information;
                      as well as the right to have a rebuttal statement attached to the alleged
                      erroneous information if the previous employer and I cannot agree on the
                      accuracy of the information. I understand that if I wish to review previous
                      employer-provided investigative information, I must submit a written request,
                      which may be done at any time, including when applying, or as late as 30 days
                      after being employed or being notified of denial of employment. I understand
                      that if I have not arranged to pick up or receive the requested records within
                      thirty (30) days of them becoming available, it may be considered that I have
                      waived my request to review the record(s).
                    </p>
                  </div>
                  <p class="text-xs font-bold text-slate-700 mt-2">
                    I have read, fully understand and agree to all terms as set forth in the company
                    Authorization Release.
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <InputGroup
                  v-model="form.authReleaseSignature"
                  label="Applicant Signature"
                  required
                  placeholder="Type your full name"
                  :error="errors['authReleaseSignature']"
                />

                <InputGroup
                  v-model="form.authReleaseDate"
                  label="Date Signed"
                  type="date"
                  required
                  :disabled="true"
                  :error="errors['authReleaseDate']"
                />
              </div>
            </div>

            <!-- Step 10: Alcohol & Drug Testing Policy -->

            <div v-else-if="currentStep === 10" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h3
                    class="text-sm font-bold text-slate-700 uppercase tracking-tighter text-center"
                  >
                    Alcohol & Drug Testing Policy
                  </h3>

                  <p class="text-[14px] text-slate-600 text-justify">
                    Please review the company alcohol and drug testing policy below. Once finished,
                    electronically sign to confirm receipt, understanding and agree. Upon completion
                    of the online application, you will be emailed a copy of this policy. You may
                    also click the Download button in the top right corner of the viewer to save a
                    copy of the policy now.
                  </p>

                  <div class="border border-slate-200 rounded-lg overflow-hidden h-150 bg-slate-50">
                    <iframe
                      src="/company_alcohol_and_drug_testing_policy.pdf"
                      class="w-full h-full"
                      title="Alcohol & Drug Testing Policy"
                    ></iframe>
                  </div>

                  <p class="text-xs font-bold text-slate-700 mt-2">
                    I have read, fully understand and agree to all terms as set forth in the company
                    alcohol and drug testing policy.
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <InputGroup
                    v-model="form.alcoholDrugPolicySignature"
                    label="Prospective Employee Signature"
                    required
                    placeholder="Type your full name"
                    :error="errors['alcoholDrugPolicySignature']"
                  />

                  <InputGroup
                    v-model="form.alcoholDrugPolicyDate"
                    label="Date Signed"
                    type="date"
                    required
                    :disabled="true"
                    :error="errors['alcoholDrugPolicyDate']"
                  />
                </div>
              </div>
            </div>

            <!-- Step 11: General Work Policy -->
            <div v-else-if="currentStep === 11" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h3
                    class="text-sm font-bold text-slate-700 uppercase tracking-tighter text-center"
                  >
                    General Work Policy
                  </h3>

                  <p class="text-[14px] text-slate-600 text-justify">
                    Please review the company general work policy below. Once finished,
                    electronically sign to confirm receipt, understanding and agree. Upon completion
                    of the online application, you will be emailed a copy of this policy. You may
                    also click the Download button in the top right corner of the viewer to save a
                    copy of the policy now.
                  </p>

                  <div class="border border-slate-200 rounded-lg overflow-hidden h-150 bg-slate-50">
                    <iframe
                      src="/general_work_policy.pdf"
                      class="w-full h-full"
                      title="General Work Policy"
                    ></iframe>
                  </div>

                  <p class="text-xs font-bold text-slate-700 mt-2">
                    I have read, fully understand and agree to all terms as set forth in the company
                    general work policy.
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <InputGroup
                    v-model="form.generalWorkPolicySignature"
                    label="Prospective Employee Signature"
                    required
                    placeholder="Type your full name"
                    :error="errors['generalWorkPolicySignature']"
                  />

                  <InputGroup
                    v-model="form.generalWorkPolicyDate"
                    label="Date Signed"
                    type="date"
                    required
                    :disabled="true"
                    :error="errors['generalWorkPolicyDate']"
                  />
                </div>
              </div>
            </div>

            <!-- Step 12: Fair Credit Reporting Authorization -->

            <div v-else-if="currentStep === 12" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-4">
                <div class="space-y-2">
                  <h3
                    class="text-sm font-bold text-slate-700 uppercase tracking-tighter text-center"
                  />
                  General Consent for Limited Queries of the FMCSA Drug and Alcohol Clearinghouse
                  Fair Credit Reporting Authorization

                  <div
                    class="text-[12px] text-slate-600 leading-relaxed text-justify space-y-2 max-h-96 overflow-y-auto pr-2 border border-slate-100 rounded-lg p-3 bg-slate-50/50"
                  >
                    <p>
                      Pursuant to the federal Fair Credit Reporting Act, I hereby authorize
                      <strong>Phoenix Bus Inc</strong> and its designated agents and representatives
                      to conduct a comprehensive review of my background through a consumer report
                      and/or an investigative consumer report to be generated for employment,
                      promotion, reassignment or retention as an employee. I understand that the
                      scope of the consumer report/investigative consumer report may include, but is
                      not limited to, the following areas: verification of Social Security number;
                      current and previous residences; employment history, including all personnel
                      files; education; references; credit history and reports; criminal history,
                      including records from any criminal justice agency in any or all federal,
                      state or county jurisdictions; birth records; motor vehicle records, including
                      traffic citations and registration; and any other public records.
                    </p>

                    <p>
                      I,
                      <strong
                        >{{ capitalizeName(form.personalInfo.firstName) }}
                        {{ capitalizeName(form.personalInfo.middleName) }}
                        {{ form.personalInfo.lastName }}</strong
                      >, authorize the complete release of these records or data pertaining to me
                      that an individual, company, firm, corporation or public agency may have. I
                      hereby authorize and request any present or former employer, school, police
                      department, financial institution or other persons having personal knowledge
                      of me to furnish <strong>Phoenix Bus Inc</strong> or its designated agents
                      with any and all information in their possession regarding me in connection
                      with an application of employment. I am authorizing that a photocopy of this
                      authorization be accepted with the same authority as the original.
                    </p>

                    <p>
                      I understand that, pursuant to the federal Fair Credit Reporting Act, if any
                      adverse action is to be taken based upon the consumer report, a copy of the
                      report and a summary of the consumer's rights will be provided to me.
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <InputGroup
                    v-model="form.fairCreditReportingSignature"
                    label="Applicant Signature"
                    placeholder="Type your full name"
                    :error="errors['fairCreditReportingSignature']"
                  />

                  <InputGroup
                    v-model="form.fairCreditReportingDate"
                    label="Date Signed"
                    type="date"
                    required
                    :disabled="true"
                    :error="errors['fairCreditReportingDate']"
                  />
                </div>
              </div>
            </div>

            <!-- Step 13: Additional Notes -->

            <div v-else-if="currentStep === 13" class="space-y-4 flex-1 overflow-y-auto">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
                  >Additional Notes</label
                >

                <textarea
                  v-model="form.notes"
                  rows="4"
                  class="input-base w-full resize-none"
                  placeholder="Any additional information, certifications, special qualifications, or comments..."
                ></textarea>
              </div>
            </div>
          </Transition>

          <div class="pt-6 mt-auto flex gap-3 border-t border-slate-100">
            <BaseButton
              v-if="currentStep > 1"
              label="Back"
              variant="secondary"
              :icon="ArrowLeft"
              @click="prevStep"
              class="w-1/3 justify-center"
            />

            <BaseButton
              v-if="currentStep < totalSteps"
              label="Next Step"
              variant="primary"
              :icon="ArrowRight"
              type="submit"
              class="flex-1 justify-center"
            />

            <button
              v-else
              v-cursor
              type="submit"
              :disabled="loading"
              class="flex-1 btn-up-hover-effect bg-linear-to-r from-indigo-600 to-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <span>{{ loading ? 'Submitting...' : 'Submit Application' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-4 text-center w-full z-10">
      <p class="text-white text-[10px] font-bold uppercase tracking-widest opacity-60">
        &copy; 2026 PhoenixBus Orlando
      </p>
    </div>
  </AnimatedBody>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { dataService } from '@/services/dataService'
import { Check, Bus, Loader2, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import AnimatedBody from '@/Components/ui/AnimatedBody.vue'
import InputGroup from '@/Components/ui/InputGroup.vue'
import BaseButton from '@/Components/ui/buttons/BaseButton.vue'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import FileInput from '@/Components/ui/FileInput.vue'
import { VEHICLE_TYPES } from '@/utils/constants'
import type { DriverApplicationForm, VehicleTypes } from '@/types'
import { capitalizeName } from '../utils/utils'
import { ApplicationSchema, EmploymentSchema } from '@/shared/schemas/ApplicationSchema'
import { z } from 'zod'

const loading = ref(false)
const submitted = ref(false)
const currentStep = ref(1)
const totalSteps = 13
const errors = ref<Record<string, string>>({})

const licenseFrontUrl = ref('')
const licenseBackUrl = ref('')
const medicalCardUrl = ref('')

const licenseFrontName = ref('')
const licenseBackName = ref('')
const medicalCardName = ref('')

const form = ref<DriverApplicationForm>({
  id: '',
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    ssnNumber: '',
  },
  addresses: [{ street: '', city: '', state: '', zip: '', fromDate: '', toDate: '' }],

  // License Data
  licenses: [
    {
      number: '',
      state: 'FL',
      class: '',
      endorsements: '',
      restrictions: '',
      emissionDate: '',
      expirationDate: '',
    },
  ],

  // Accident & Violation History (last 3 years)
  accidents: [],
  violations: [],
  forfeitures: '',
  deniedLicense: false,
  suspendedLicense: false,
  denialSuspensionExplanation: '',

  // Employment History
  employmentHistory: [],
  notes: '',

  // Driving Experience
  vehicleExperience: [
    {
      type: 'Passenger Bus',
    },
  ],
  experienceYears: 0,

  licenseFront: null,
  licenseBack: null,
  medicalCard: null,

  drugTestPositiveOrRefusal: false,
  drugTestDocumentation: 'N/A',
  drugTestSignature: '',
  drugTestDate: '',
  authReleaseSignature: '',
  authReleaseDate: '',
  pspDisclosureSignature: '',
  pspDisclosureDate: '',
  fmcsaConsentSignature: '',
  fmcsaConsentDate: '',
  alcoholDrugPolicySignature: '',
  alcoholDrugPolicyDate: '',
  generalWorkPolicySignature: '',
  generalWorkPolicyDate: '',
  fairCreditReportingSignature: '',
  fairCreditReportingDate: '',
})

async function handleLicenseFrontUpload(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    const file = target.files?.[0]
    if (file) {
      form.value.licenseFront = file
      licenseFrontName.value = file.name
      try {
        const applicantName =
          `${form.value.personalInfo.firstName} ${form.value.personalInfo.lastName}`.trim() ||
          'Unknown Applicant'
        const { url } = await dataService.uploadDocument(
          null,
          'licenseFront',
          file,
          new Date().toISOString(),
          'Application Upload',
          undefined,
          applicantName,
        )
        licenseFrontUrl.value = url
        form.value.licenseFront = url
      } catch (err) {
        console.error('Failed to upload license front', err)
        alert('Failed to upload file. Please try again.')
      }
    }
    return
  }
}

async function handleLicenseBackUpload(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    const file = target.files?.[0]
    if (file) {
      form.value.licenseBack = file
      licenseBackName.value = file.name
      try {
        const applicantName =
          `${form.value.personalInfo.firstName} ${form.value.personalInfo.lastName}`.trim() ||
          'Unknown Applicant'
        const { url } = await dataService.uploadDocument(
          null,
          'licenseBack',
          file,
          new Date().toISOString(),
          'Application Upload',
          undefined,
          applicantName,
        )
        licenseBackUrl.value = url
        form.value.licenseBack = url
      } catch (err) {
        console.error('Failed to upload license back', err)
        alert('Failed to upload file. Please try again.')
      }
    }
    return
  }
}

async function handleMedicalCardUpload(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement) {
    const file = target.files?.[0]
    if (file) {
      form.value.medicalCard = file
      medicalCardName.value = file.name
      try {
        const applicantName =
          `${form.value.personalInfo.firstName} ${form.value.personalInfo.lastName}`.trim() ||
          'Unknown Applicant'
        const { url } = await dataService.uploadDocument(
          null,
          'medicalCard',
          file,
          new Date().toISOString(),
          'Application Upload',
          undefined,
          applicantName,
        )
        medicalCardUrl.value = url
        form.value.medicalCard = url
      } catch (err) {
        console.error('Failed to upload medical card', err)
        alert('Failed to upload file. Please try again.')
      }
    }
    return
  }
}

// Track if address end-date field; when enabled, we set "present"
const presentAddress = ref<boolean>(false)

const currentStepName = computed(() => {
  switch (currentStep.value) {
    case 1:
      return 'Personal Info'
    case 2:
      return 'Address History'
    case 3:
      return 'License Data'
    case 4:
      return 'Driving Experience'
    case 5:
      return 'Accidents & Violations'
    case 6:
      return 'Employment History'
    case 7:
      return 'PSP Disclosure'
    case 8:
      return 'FMCSA Clearinghouse'
    case 9:
      return 'Authorization & Release'
    case 10:
      return 'Alcohol & Drug Policy'
    case 11:
      return 'General Work Policy'
    case 12:
      return 'Fair Credit Report Authorization'
    case 13:
      return 'Additional Info'
    default:
      return ''
  }
})

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps) * 100
})

// Persistence Logic
const STORAGE_KEY = 'driver_application_progress'

function saveProgress() {
  try {
    const dataToSave = {
      form: form.value,
      currentStep: currentStep.value,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (e) {
    console.warn('Failed to save application progress', e)
  }
}

watch(
  [form, currentStep],
  () => {
    saveProgress()
  },
  { deep: true },
)

// Auto-fill dates on signature
const today = new Date().toISOString().split('T')[0]

function autoFillDateOnSignature(
  signatureKey: keyof DriverApplicationForm,
  dateKey: keyof DriverApplicationForm,
) {
  watch(
    () => form.value[signatureKey],
    (newVal) => {
      form.value[dateKey] = newVal ? today : ''
    },
  )
}

autoFillDateOnSignature('drugTestSignature', 'drugTestDate')
autoFillDateOnSignature('pspDisclosureSignature', 'pspDisclosureDate')
autoFillDateOnSignature('fmcsaConsentSignature', 'fmcsaConsentDate')
autoFillDateOnSignature('alcoholDrugPolicySignature', 'alcoholDrugPolicyDate')
autoFillDateOnSignature('authReleaseSignature', 'authReleaseDate')
autoFillDateOnSignature('generalWorkPolicySignature', 'generalWorkPolicyDate')
autoFillDateOnSignature('fairCreditReportingSignature', 'fairCreditReportingDate')

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.form) {
        // Merge saved form with default structure to ensure new fields exist
        form.value = { ...form.value, ...parsed.form }
      }
      if (parsed.currentStep) {
        currentStep.value = parsed.currentStep
      }
    } catch (e) {
      console.warn('Failed to restore application progress', e)
    }
  }
})

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function validateStep() {
  errors.value = {}
  let stepSchema: z.ZodTypeAny | null = null
  let dataToValidate = {}

  // Map steps to schema parts
  switch (currentStep.value) {
    case 1: // Personal Info
      stepSchema = ApplicationSchema.shape.personalInfo
      dataToValidate = form.value.personalInfo
      break
    case 2: // Address History
      stepSchema = ApplicationSchema.shape.addresses
      dataToValidate = form.value.addresses
      break
    case 3: // License Data
      stepSchema = ApplicationSchema.shape.licenses
      dataToValidate = form.value.licenses
      break
    case 4: // Driving Experience
      stepSchema = z.object({
        experienceYears: ApplicationSchema.shape.experienceYears,
        vehicleExperience: ApplicationSchema.shape.vehicleExperience,
      })
      dataToValidate = {
        experienceYears: form.value.experienceYears,
        vehicleExperience: form.value.vehicleExperience,
      }
      break
    case 5: // Accidents & Violations
      stepSchema = z
        .object({
          accidents: ApplicationSchema.shape.accidents,
          violations: ApplicationSchema.shape.violations,
          forfeitures: ApplicationSchema.shape.forfeitures,
          deniedLicense: ApplicationSchema.shape.deniedLicense,
          suspendedLicense: ApplicationSchema.shape.suspendedLicense,
          denialSuspensionExplanation: ApplicationSchema.shape.denialSuspensionExplanation,
        })
        .superRefine((data, ctx) => {
          if ((data.deniedLicense || data.suspendedLicense) && !data.denialSuspensionExplanation) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Explanation is required when license is denied or suspended',
              path: ['denialSuspensionExplanation'],
            })
          }
        })
      dataToValidate = {
        accidents: form.value.accidents,
        violations: form.value.violations,
        forfeitures: form.value.forfeitures,
        deniedLicense: form.value.deniedLicense,
        suspendedLicense: form.value.suspendedLicense,
        denialSuspensionExplanation: form.value.denialSuspensionExplanation,
      }
      break
    case 6: // Employment History
      stepSchema = z.object({
        employmentHistory: z
          .array(EmploymentSchema)
          .min(1, 'At least one employment record is required'),
      })
      dataToValidate = { employmentHistory: form.value.employmentHistory }
      break
    case 7: // PSP
      stepSchema = z.object({
        pspDisclosureSignature: ApplicationSchema.shape.pspDisclosureSignature,
        pspDisclosureDate: ApplicationSchema.shape.pspDisclosureDate,
      })
      dataToValidate = {
        pspDisclosureSignature: form.value.pspDisclosureSignature,
        pspDisclosureDate: form.value.pspDisclosureDate,
      }
      break
    case 8: // FMCSA Clearinghouse
      stepSchema = z.object({
        fmcsaConsentSignature: ApplicationSchema.shape.fmcsaConsentSignature,
        fmcsaConsentDate: ApplicationSchema.shape.fmcsaConsentDate,
      })
      dataToValidate = {
        fmcsaConsentSignature: form.value.fmcsaConsentSignature,
        fmcsaConsentDate: form.value.fmcsaConsentDate,
      }
      break
    case 9: // Auth Release
      stepSchema = z.object({
        authReleaseSignature: ApplicationSchema.shape.authReleaseSignature,
        authReleaseDate: ApplicationSchema.shape.authReleaseDate,
      })
      dataToValidate = {
        authReleaseSignature: form.value.authReleaseSignature,
        authReleaseDate: form.value.authReleaseDate,
      }
      break
    case 10: // Alcohol/Drug Policy
      stepSchema = z.object({
        alcoholDrugPolicySignature: ApplicationSchema.shape.alcoholDrugPolicySignature,
        alcoholDrugPolicyDate: ApplicationSchema.shape.alcoholDrugPolicyDate,
      })
      dataToValidate = {
        alcoholDrugPolicySignature: form.value.alcoholDrugPolicySignature,
        alcoholDrugPolicyDate: form.value.alcoholDrugPolicyDate,
      }
      break
    case 11: // General Work Policy
      stepSchema = z.object({
        generalWorkPolicySignature: ApplicationSchema.shape.generalWorkPolicySignature,
        generalWorkPolicyDate: ApplicationSchema.shape.generalWorkPolicyDate,
      })
      dataToValidate = {
        generalWorkPolicySignature: form.value.generalWorkPolicySignature,
        generalWorkPolicyDate: form.value.generalWorkPolicyDate,
      }
      break
    case 12: // Fair Credit
      stepSchema = z.object({
        fairCreditReportingSignature: ApplicationSchema.shape.fairCreditReportingSignature,
        fairCreditReportingDate: ApplicationSchema.shape.fairCreditReportingDate,
      })
      dataToValidate = {
        fairCreditReportingSignature: form.value.fairCreditReportingSignature,
        fairCreditReportingDate: form.value.fairCreditReportingDate,
      }
      break
    // Step 13 (Notes) is optional, no validation needed usually
    default:
      return true
  }

  if (stepSchema) {
    const result = stepSchema.safeParse(dataToValidate)
    if (!result.success) {
      // Map Zod errors to errors ref
      result.error.issues.forEach((issue) => {
        // Flatten path for arrays: addresses[0].street -> "addresses.0.street"
        // For simple objects: personalInfo.firstName -> "firstName" (because we validated partial object)

        let key = issue.path.join('.')

        // Special handling if we validated a partial object like in step 5, 7, etc.
        // The path in issue will be relative to dataToValidate.
        // E.g. dataToValidate = { pspDisclosureSignature: ... } -> path is ["pspDisclosureSignature"]
        // So key is just "pspDisclosureSignature".

        // However, for arrays like "addresses", path is [0, "street"]. key becomes "0.street".
        // But in template we loop: errors[`addresses.${index}.street`] ?
        // We validated form.value.addresses directly. So path is [0, "street"].
        // So we need to prefix with parent key IF we are validating just that array.

        if (currentStep.value === 2) {
          key = `addresses.${key}`
        } else if (currentStep.value === 3) {
          key = `licenses.${key}`
        } else if (currentStep.value === 1) {
          // Personal info is nested in form, but we validated the object directly.
          // In template: form.personalInfo.firstName.
          // Errors should probably be keyed by 'personalInfo.firstName' or just 'firstName' depending on binding.
          // Let's bind with full path to avoid collision.
          key = `personalInfo.${key}`
        }

        errors.value[key] = issue.message
      })

      // Scroll to top error?
      return false
    }
  }

  return true
}

async function handleNextOrSubmit() {
  const isValid = await validateStep()
  if (!isValid) {
    // Optional: Scroll to first error
    const firstError = document.querySelector('.border-red-500')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  if (currentStep.value < totalSteps) {
    nextStep()
  } else {
    await submit()
  }
}

async function submit() {
  loading.value = true

  try {
    // Inject Uploaded URLs into the payload
    // Note: The form.value.licenseFront is a File object, which can't be JSON serialized properly.
    // We override it with the URL string if available.

    // We create a copy to avoid mutating the reactive form state with mixed types if we want to keep File there
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = { ...form.value }

    if (licenseFrontUrl.value) payload.licenseFront = licenseFrontUrl.value
    if (licenseBackUrl.value) payload.licenseBack = licenseBackUrl.value
    if (medicalCardUrl.value) payload.medicalCard = medicalCardUrl.value

    // Ensure experienceYears is number
    payload.experienceYears = form.value.experienceYears || 0

    await dataService.submitApplication(payload)

    submitted.value = true
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Error submitting application:', err)

    alert('Failed to submit application. Please try again.')
  } finally {
    loading.value = false
  }
}

function reset() {
  form.value = {
    id: '',
    personalInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      email: '',
      phone: '',
      ssnNumber: '',
      medicalExpirationDate: '',
    },
    addresses: [
      { street: '', city: '', state: '', zip: '', fromDate: '', toDate: '', present: undefined },
    ],
    licenses: [
      {
        number: '',
        state: 'FL',
        class: '',
        endorsements: '',
        restrictions: '',
        emissionDate: '',
        expirationDate: '',
      },
    ],
    accidents: [],
    violations: [],
    forfeitures: '',
    deniedLicense: false,
    suspendedLicense: false,
    denialSuspensionExplanation: '',
    employmentHistory: [],
    notes: '',
    vehicleExperience: [{ type: '' }],
    experienceYears: 0,
    licenseFront: null,
    licenseBack: null,
    medicalCard: null,

    drugTestPositiveOrRefusal: false,
    drugTestDocumentation: 'N/A',
    drugTestSignature: '',
    drugTestDate: '',
    authReleaseSignature: '',
    authReleaseDate: '',
    pspDisclosureSignature: '',
    pspDisclosureDate: '',
    fmcsaConsentSignature: '',
    fmcsaConsentDate: '',
    alcoholDrugPolicySignature: '',
    alcoholDrugPolicyDate: '',
    generalWorkPolicySignature: '',
    generalWorkPolicyDate: '',
    fairCreditReportingSignature: '',
    fairCreditReportingDate: '',
  }
  currentStep.value = 1
  submitted.value = false

  presentAddress.value = false
  licenseFrontName.value = ''
  licenseBackName.value = ''
  medicalCardName.value = ''
  localStorage.removeItem(STORAGE_KEY)
}

function addAddress() {
  form.value.addresses.push({
    street: '',
    city: '',
    state: '',
    zip: '',
    fromDate: '',
    toDate: '',
    present: undefined,
  })
}

function removeAddress(index: number) {
  if (form.value.addresses.length > 1) {
    form.value.addresses.splice(index, 1)
  }
}

function addLicense() {
  form.value.licenses.push({
    number: '',
    state: 'FL',
    class: '',
    endorsements: '',
    restrictions: '',
    emissionDate: '',
    expirationDate: '',
  })
}

function removeLicense(index: number) {
  if (form.value.licenses.length > 1) {
    form.value.licenses.splice(index, 1)
  }
}

function addAccident() {
  form.value.accidents.push({
    date: '',
    location: '',
    description: '',
    injuries: false,
    fatalities: false,
  })
}

function removeAccident(index: number) {
  form.value.accidents.splice(index, 1)
}

function addViolation() {
  form.value.violations.push({ date: '', violation: '', location: '', penalty: '' })
}

function removeViolation(index: number) {
  form.value.violations.splice(index, 1)
}

function addEmployment() {
  form.value.employmentHistory.push({
    companyName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    position: '',
    description: '',
    fromDate: '',
    toDate: '',
    reasonForLeaving: '',
    wasCdl: false,
  })
}

function removeEmployment(index: number) {
  form.value.employmentHistory.splice(index, 1)
}

function isVehicleSelected(type: string) {
  return form.value.vehicleExperience.some((v) => v.type === type)
}

function toggleVehicleType(type: VehicleTypes, checked: boolean) {
  if (checked) {
    form.value.vehicleExperience.push({ type })
    if (!isVehicleSelected(type)) {
      form.value.vehicleExperience.push({ type })
    }
    const index = form.value.vehicleExperience.findIndex((v) => v.type === type)
    if (index !== -1) {
      form.value.vehicleExperience.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.app-card {
  position: relative;
  z-index: 10;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
