<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <form @submit.prevent="handleSubmit">
                <div>
                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100"
                  >
                    <UserIcon
                      class="h-6 w-6 text-emerald-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                    >
                      {{
                        mode === "add"
                          ? "Tambah Pelanggan Baru"
                          : "Edit Pelanggan"
                      }}
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        {{
                          mode === "add"
                            ? "Masukkan informasi pelanggan baru"
                            : "Perbarui informasi pelanggan"
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mt-6 space-y-4">
                  <!-- Nama -->
                  <div>
                    <label
                      for="nama"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nama Lengkap <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-2">
                      <input
                        id="nama"
                        v-model="form.nama"
                        type="text"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        :class="{ 'ring-red-500': errors.nama }"
                        placeholder="Masukkan nama lengkap"
                      />
                      <p v-if="errors.nama" class="mt-1 text-sm text-red-600">
                        {{ errors.nama }}
                      </p>
                    </div>
                  </div>

                  <!-- Email -->
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div class="mt-2">
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        :class="{ 'ring-red-500': errors.email }"
                        placeholder="contoh@email.com"
                      />
                      <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                        {{ errors.email }}
                      </p>
                    </div>
                  </div>

                  <!-- Telepon -->
                  <div>
                    <label
                      for="telepon"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nomor Telepon
                    </label>
                    <div class="mt-2">
                      <input
                        id="telepon"
                        v-model="form.telepon"
                        type="tel"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        :class="{ 'ring-red-500': errors.telepon }"
                        placeholder="08xxxxxxxxxx"
                        @input="validatePhoneNumber"
                      />
                      <p
                        v-if="errors.telepon"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.telepon }}
                      </p>
                    </div>
                  </div>

                  <!-- Alamat -->
                  <div>
                    <label
                      for="alamat"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Alamat
                    </label>
                    <div class="mt-2">
                      <textarea
                        id="alamat"
                        v-model="form.alamat"
                        rows="3"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                        placeholder="Masukkan alamat lengkap"
                      />
                    </div>
                  </div>

                  <!-- Status (hanya untuk edit) -->
                  <div v-if="mode === 'edit'">
                    <label
                      for="status"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Status
                    </label>
                    <div class="mt-2">
                      <select
                        id="status"
                        v-model="form.status"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                      >
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Non-Aktif</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3"
                >
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    @click="$emit('close')"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
                  >
                    <svg
                      v-if="loading"
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{
                      mode === "add" ? "Tambah Pelanggan" : "Simpan Perubahan"
                    }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { UserIcon } from "@heroicons/vue/24/outline";

interface Props {
  isOpen: boolean;
  pelanggan?: any;
  mode: "add" | "edit";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

// Reactive state
const loading = ref(false);
const form = ref({
  nama: "",
  email: "",
  telepon: "",
  alamat: "",
  status: "aktif",
});

const errors = ref({
  nama: "",
  email: "",
  telepon: "",
});

// Watch for pelanggan prop changes
watch(
  () => props.pelanggan,
  (newPelanggan) => {
    if (newPelanggan && props.mode === "edit") {
      form.value = {
        nama: newPelanggan.nama || "",
        email: newPelanggan.email || "",
        telepon: newPelanggan.telepon || "",
        alamat: newPelanggan.alamat || "",
        status: newPelanggan.status || "aktif",
      };
    } else {
      // Reset form for add mode
      form.value = {
        nama: "",
        email: "",
        telepon: "",
        alamat: "",
        status: "aktif",
      };
    }
    // Clear errors
    errors.value = {
      nama: "",
      email: "",
      telepon: "",
    };
  },
  { immediate: true }
);

// Methods
const validateForm = () => {
  errors.value = {
    nama: "",
    email: "",
    telepon: "",
  };

  let isValid = true;

  // Validate nama
  if (!form.value.nama.trim()) {
    errors.value.nama = "Nama tidak boleh kosong";
    isValid = false;
  } else if (form.value.nama.trim().length < 2) {
    errors.value.nama = "Nama minimal 2 karakter";
    isValid = false;
  }

  // Validate email if provided
  if (form.value.email && !isValidEmail(form.value.email)) {
    errors.value.email = "Format email tidak valid";
    isValid = false;
  }

  // Validate phone if provided
  if (form.value.telepon && !isValidPhoneNumber(form.value.telepon)) {
    errors.value.telepon = "Nomor telepon hanya boleh berisi angka";
    isValid = false;
  }

  return isValid;
};

const validatePhoneNumber = () => {
  const phoneNumber = form.value.telepon;
  if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
    errors.value.telepon = "Nomor telepon hanya boleh berisi angka";
  } else {
    errors.value.telepon = "";
  }
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string) => {
  return /^\d+$/.test(phone);
};

const generatePelangganId = () => {
  // Generate ID dengan format P001, P002, dst.
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `P${randomNum}`;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    const payload = {
      ...form.value,
      nama: form.value.nama.trim(),
      email: form.value.email.trim() || null,
      telepon: form.value.telepon.trim() || null,
      alamat: form.value.alamat.trim() || null,
    };

    if (props.mode === "add") {
      payload.id_pelanggan = generatePelangganId();
      const { error } = await $fetch("/api/kasir/pelanggan", {
        method: "POST",
        body: payload,
      });

      if (error) throw error;

      // Show success toast
      const toast = useToast();
      toast.success("Berhasil", "Pelanggan baru berhasil ditambahkan");
    } else {
      const { error } = await $fetch(
        `/api/kasir/pelanggan/${props.pelanggan.id_pelanggan}`,
        {
          method: "PUT",
          body: payload,
        }
      );

      if (error) throw error;

      // Show success toast
      const toast = useToast();
      toast.success("Berhasil", "Data pelanggan berhasil diperbarui");
    }

    emit("saved");
  } catch (error) {
    console.error("Error saving pelanggan:", error);

    // Show error toast
    const toast = useToast();
    toast.error(
      "Gagal",
      error.message || "Terjadi kesalahan saat menyimpan data"
    );
  } finally {
    loading.value = false;
  }
};
</script>
