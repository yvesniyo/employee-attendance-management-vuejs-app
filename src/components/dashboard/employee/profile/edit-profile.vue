<template>
  <div class="row">
    <div class="col-md-12 p-0 m-0">
      <md-app-toolbar class="md-primary border-0">
        <md-button class="md-icon-button" @click="$router.go(-1)">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <span class="md-title"> {{ $t("Edit Profile") }} </span>
      </md-app-toolbar>
    </div>
    <div class="col-md-12 col-sm-12 m-0 p-0">
      <div v-if="uploadingImage" class="progress">
        <div
          class="progress-bar progress-bar-info progress-bar-striped"
          role="progressbar"
          :aria-valuenow="imageUploadprogress"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: imageUploadprogress + '%' }"
        >
          {{ imageUploadprogress }}%
        </div>
      </div>
      <div class="md-layout pb-3">
        <div class="md-layout-item pl-3 md-size-65 pt-4 text-left md-caption">
          <label class="">{{ $t("NID Image") }}</label>
        </div>

        <el-upload
          class="upload-demo ml-3 md-size-25 pt-4 md-layout-item"
          ref="upload"
          :show-file-list="false"
          action="/"
          :auto-upload="true"
          :on-success="handleNidUploadSuccess"
          :before-upload="beforeNidUpload"
        >
          <span
            slot="trigger"
            class="text-monospace text-warning md-caption alert-link"
          >
            <label v-if="user.nid_image">Change Image</label>
            <label v-else>Upload</label>
          </span>
        </el-upload>

        <div class="">
          <el-image
            v-if="user.nid_image"
            style="height: 150px"
            class="m-3"
            :src="user.nid_image.full_url"
          ></el-image>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-12">
      <form class="md-layout" @submit.prevent="submit">
        <md-field :class="{ 'md-invalid': valid.national_id }">
          <label for="national_id">{{ $t("National Id") }}</label>
          <md-input
            name="national_id"
            id="national_id"
            type="text"
            autocomplete="none"
            v-model="form.national_id"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.national_id">
            {{ valid.national_id }}
          </span>
        </md-field>
        <md-field :class="{ 'md-invalid': valid.phone }">
          <label for="phone">{{ $t("Phone") }}</label>
          <md-input
            name="phone"
            id="phone"
            autocomplete="none"
            v-model="form.phone"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.phone">{{ valid.phone }}</span>
        </md-field>
        <md-field :class="{ 'md-invalid': valid.email }">
          <label for="email">{{ $t("Email") }}</label>
          <md-input
            name="email"
            id="email"
            autocomplete="none"
            v-model="form.email"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.email">{{ valid.email }}</span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.name }">
          <label for="name">{{ $t("Name") }}</label>
          <md-input
            name="name"
            id="name"
            type="text"
            autocomplete="none"
            v-model="form.name"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.name">
            {{ valid.name }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.country }">
          <label for="country">{{ $t("Country") }}</label>
          <md-input
            name="country"
            id="country"
            type="text"
            class="text-uppercase"
            autocomplete="none"
            v-model="form.country"
            :disabled="true"
          />
          <span class="md-error" v-if="valid.country">
            {{ valid.country }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.province }">
          <label for="province">{{ $t("Province") }}</label>
          <md-input
            name="province"
            id="province"
            type="text"
            class="text-uppercase"
            autocomplete="none"
            v-model="form.province"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.province">
            {{ valid.province }}
          </span>
        </md-field>
        <md-field :class="{ 'md-invalid': valid.district }">
          <label for="district">{{ $t("District") }}</label>
          <md-input
            name="district"
            id="district"
            type="text"
            class="text-uppercase"
            autocomplete="none"
            v-model="form.district"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.district">
            {{ valid.district }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.sector }">
          <label for="sector">{{ $t("Sector") }}</label>
          <md-input
            name="sector"
            id="sector"
            type="text"
            class="text-uppercase"
            autocomplete="none"
            v-model="form.sector"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.sector">
            {{ valid.sector }}
          </span>
        </md-field>

        <md-field :class="{ 'md-invalid': valid.village }">
          <label for="village">{{ $t("Village") }}</label>
          <md-input
            name="village"
            id="village"
            type="text"
            class="text-uppercase"
            autocomplete="none"
            v-model="form.village"
            :disabled="sending"
          />
          <span class="md-error" v-if="valid.village">
            {{ valid.village }}
          </span>
        </md-field>

        <md-snackbar :md-active.sync="formSubmitResponseStatus">
          {{ formSubmitResponseMessage }}
        </md-snackbar>

        <md-button
          :disabled="sending"
          class="md-raised md-primary md-ripple-enter-active"
          style="flex: 1"
          type="submit"
          >{{ $t("Update profile") }}
        </md-button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { bus } from "@/plugins/bus.js";

export default {
  name: "edit-profile",
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  },
  data: () => ({
    form: {
      phone: "",
      national_id: "",
      email: "",
      name: "",
      country: "",
      province: "",
      district: "",
      sector: "",
      village: ""
    },
    valid: {
      phone: null,
      national_id: null,
      email: null,
      name: null,
      country: null,
      province: null,
      district: null,
      sector: null,
      village: null
    },
    userLoggedIn: false,
    sending: false,
    formSubmitResponseMessage: "",
    formSubmitResponseStatus: false,
    imageUploadprogress: 0,
    uploadingImage: false
  }),
  created() {
    this.initForm();
  },

  methods: {
    ...mapActions({
      register: "auth/register",
      me: "auth/me",
      editProfile: "profile/editProfile",
      uploadMyNidImage: "profile/uploadNidImage"
    }),
    handleNidUploadSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    uploadNidImage(file) {
      const loading = this.$loading({
        lock: true,
        text: "Uploading Image",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      loading.close();

      let formData = new FormData();
      formData.append("image", file);
      const ctx = this;
      ctx.imageUploadprogress = 0;
      ctx.uploadingImage = true;

      formData.event = event => {
        ctx.imageUploadprogress = Math.round(
          (100 * event.loaded) / event.total
        );
      };
      this.uploadMyNidImage(formData)
        .then(response => {
          ctx.uploadingImage = false;
          loading.close();
          ctx.$notify({
            title: ctx.$t("Success"),
            type: "success",
            message: response.data.message
          });
        })
        .catch(error => {
          ctx.uploadingImage = false;
          loading.close();
          this.$message.error(ctx.$t("Error occured try again."));
        });
    },
    beforeNidUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error(this.$t("Nid picture must be JPG or PNG format!"));
      }
      if (!isLt2M) {
        this.$message.error(this.$t("Nid picture size can not exceed 1MB!"));
      }
      if (isJPG && isLt2M) {
        this.uploadNidImage(file);
      }
      return false;
    },
    initForm() {
      const user = this.user;
      Object.keys(this.form).forEach((key, i) => {
        this.form[key] = user[key];
      });
    },
    clearForm() {},
    clearLastErrors: function() {
      const ctx = this;
      Object.keys(this.valid).forEach(function(key) {
        ctx.$set(ctx.valid, key, null);
      });
    },
    async submit() {
      this.sending = true;
      this.clearLastErrors();
      const loading = this.$loading({
        lock: true,
        text: this.$t("Saving changes"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      const ctx = this;
      this.editProfile(this.form)
        .then(data => {
          ctx.sending = false;
          loading.close();
          ctx.formSubmitResponseMessage = data.data.message;
          ctx.formSubmitResponseStatus = true;
        })
        .catch(error => {
          ctx.sending = false;
          loading.close();
          if (error.response.status == 422) {
            ctx.formSubmitResponseMessage = error.response.data.message;
            ctx.formSubmitResponseStatus = true;
            Object.keys(error.response.data.errors).forEach(function(key) {
              ctx.$set(ctx.valid, key, error.response.data.errors[key][0]);
            });
          } else if (error.response.status == 500) {
            ctx.formSubmitResponseMessage = error.response.data.message;
            ctx.formSubmitResponseStatus = true;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.form {
  margin: auto;
  margin-top: 40px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
