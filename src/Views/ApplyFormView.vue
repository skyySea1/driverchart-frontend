<!-- src/Views/PublicApplicationForm.vue -->

<template>
  <AnimatedBody>
    <!-- Application Card -->
    <div
      class="app-card bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col"
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
                />
                <InputGroup
                  v-model="form.personalInfo.lastName"
                  label="Last Name"
                  required
                  placeholder="Doe"
                />
              </div>

              <InputGroup
                v-model="form.personalInfo.middleName"
                label="Middle Name"
                placeholder="Optional"
              />

              <InputGroup
                v-model="form.personalInfo.dob"
                label="Date of Birth"
                type="date"
                required
              />

              <InputGroup
                v-model="form.personalInfo.ssnNumber"
                label="Social Security Number"
                placeholder="123-45-6789"
                required
              />

              <InputGroup
                v-model="form.personalInfo.medicalExpirationDate"
                label="Medical Expiration Date"
                placeholder="MM/DD/YYYY"
                type="date"
                required
              />

              <InputGroup
                v-model="form.personalInfo.email"
                label="Email Address"
                type="email"
                required
                placeholder="john.doe@example.com"
              />

              <InputGroup
                v-model="form.personalInfo.phone"
                label="Phone Number"
                type="tel"
                required
                placeholder="(555) 000-0000"
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
                />

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup v-model="address.city" label="City" required placeholder="Orlando" />
                  <InputGroup v-model="address.state" label="State" required placeholder="FL" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup v-model="address.fromDate" label="From" type="date" required />
                  <InputGroup
                    v-model="address.toDate"
                    :checkboxValue="address.present || false"
                    @update:checkboxValue="address.present = $event"
                    :isEnabled="!address.present"
                    enableCheck
                    toggleTitle="Mark if this is your current address"
                    label="To"
                    type="date"
                    placeholder="Current"
                  />
                </div>
                <InputGroup v-model="address.zip" label="ZIP" required placeholder="32801" />
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
                  List all licenses/CDLs with numbers, classes, and restrictions
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
                  />
                  <InputGroup v-model="license.state" label="State" required placeholder="FL" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <InputGroup
                    v-model="license.class"
                    label="Class"
                    required
                    placeholder="A, B, C"
                  />
                  <InputGroup
                    v-model="license.endorsements"
                    type=""
                    label="Endorsements"
                    placeholder="P, S, N"
                  />
                  <InputGroup
                    v-model="license.emissionDate"
                    label="Emission Date"
                    type="date"
                    required
                  />
                  <InputGroup
                    v-model="license.expirationDate"
                    label="Expiration"
                    type="date"
                    required
                  />
                </div>

                <InputGroup
                  v-model="license.restrictions"
                  label="Restrictions"
                  placeholder="None, or list restrictions"
                />
              </div>

              <button
                @click="addLicense"
                type="button"
                class="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-semibold"
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
                />
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
                    >
                      <InputGroup
                        v-if="getVehicleEntry(vehicleType)"
                        v-model.number="getVehicleEntry(vehicleType)!.totalMileage"
                        label="Total Mileage"
                        type="number"
                        min="0"
                        placeholder="e.g. 5000"
                        required
                      />
                    </div>
                  </div>
                </div>
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
                    <InputGroup v-model="accident.date" label="Date" type="date" required />
                    <InputGroup
                      v-model="accident.location"
                      label="Location"
                      required
                      placeholder="City, State"
                    />
                  </div>

                  <InputGroup
                    v-model="accident.description"
                    label="Description"
                    required
                    placeholder="Brief description of the accident"
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
                    <InputGroup v-model="violation.date" label="Date" type="date" required />
                    <InputGroup
                      v-model="violation.location"
                      label="Location"
                      required
                      placeholder="City, State"
                    />
                  </div>

                  <InputGroup
                    v-model="violation.violation"
                    label="Violation Type"
                    required
                    placeholder="e.g., Speeding, Failure to yield"
                  />

                  <InputGroup
                    v-model="violation.penalty"
                    label="Penalty/Outcome"
                    placeholder="e.g., Fine, Points, Court date"
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
                    ></textarea>
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
                        v-model="job.wasCDL"
                        class="rounded border-slate-300"
                      />
                      <span class="text-indigo-600 font-semibold">CDL Position</span>
                    </label>
                  </div>
                  <button
                    @click="removeEmployment(index)"
                    type="button"
                    class="text-red-500 text-xs hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <InputGroup
                  v-model="job.companyName"
                  label="Company Name"
                  required
                  placeholder="ABC Transportation"
                />

                <InputGroup
                  v-model="job.address"
                  label="Company Address"
                  required
                  placeholder="123 Business St"
                />

                <div class="grid grid-cols-3 gap-2">
                  <InputGroup v-model="job.city" label="City" required placeholder="Orlando" />
                  <InputGroup v-model="job.state" label="State" required placeholder="FL" />
                  <InputGroup v-model="job.zip" label="ZIP" required placeholder="32801" />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <InputGroup
                    v-model="job.phone"
                    label="Phone"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                  />
                  <InputGroup
                    v-model="job.position"
                    label="Position Held"
                    required
                    placeholder="Bus Driver"
                  />
                </div>

                <InputGroup
                  v-model="job.description"
                  label="Employment Description"
                  placeholder="Describe your duties..."
                />

                <div class="grid grid-cols-2 gap-2">
                  <InputGroup v-model="job.fromDate" label="From Date" type="date" required />
                  <InputGroup
                    v-model="job.toDate"
                    :checkboxValue="job.present || false"
                    @update:checkboxValue="job.present = $event"
                    :isEnabled="!job.present"
                    enableCheck
                    toggleTitle="Check if this is your current job"
                    label="To Date"
                    type="date"
                    placeholder="Current"
                  />
                </div>

                <InputGroup
                  v-model="job.reasonForLeaving"
                  label="Reason for Leaving"
                  placeholder="e.g., Career advancement, relocation"
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

            <!-- Step 7: Additional Notes -->
            <div v-else-if="currentStep === 7" class="space-y-4 flex-1">
              <div class="space-y-1 h-full flex flex-col">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-tighter"
                  >Additional Notes</label
                >

                <textarea
                  v-model="form.notes"
                  rows="6"
                  class="input-base w-full resize-none flex-1"
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
import { ref, computed } from 'vue'
import { dataService } from '@/services/dataService'
import { Check, Bus, Loader2, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import AnimatedBody from '@/Components/ui/AnimatedBody.vue'
import InputGroup from '@/Components/ui/InputGroup.vue'
import BaseButton from '@/Components/ui/BaseButton.vue'
import BaseAlert from '@/Components/ui/BaseAlert.vue'
import { VEHICLE_TYPES } from '@/utils/constants'
import type { DriverApplicationForm, VehicleTypes } from '@/types'

const loading = ref(false)
const submitted = ref(false)
const currentStep = ref(1)
const totalSteps = 7

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
      state: '',
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
  vehicleExperience: [{ type: 'Passenger Bus', totalMileage: 0 }],

  experienceYears: 0,
})

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
      return 'Additional Info'
    default:
      return ''
  }
})

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps) * 100
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

async function handleNextOrSubmit() {
  if (currentStep.value < totalSteps) {
    nextStep()
  } else {
    await submit()
  }
}

async function submit() {
  loading.value = true

  try {
    await dataService.submitApplication({
      ...form.value,
      experienceYears: form.value.experienceYears || 0,
    })

    submitted.value = true
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
    },
    addresses: [{ street: '', city: '', state: '', zip: '', fromDate: '', toDate: '' }],
    licenses: [
      {
        number: '',
        state: '',
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
    vehicleExperience: [{ type: '', totalMileage: 0 }],

    experienceYears: 0,
  }
  currentStep.value = 1
  submitted.value = false

  presentAddress.value = false
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
    wasCDL: false,
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
    if (!isVehicleSelected(type)) {
      form.value.vehicleExperience.push({ type, totalMileage: 0 })
    }
  } else {
    const index = form.value.vehicleExperience.findIndex((v) => v.type === type)
    if (index !== -1) {
      form.value.vehicleExperience.splice(index, 1)
    }
  }
}

function getVehicleEntry(type: VehicleTypes) {
  return form.value.vehicleExperience.find((v) => v.type === type)
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
