<template>
  <div class="row">
    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 m-auto">
      <div class="block mt-5">
        <el-date-picker
          v-model="dateRangeAttendance"
          type="daterange"
          range-separator="-"
          @change="dateRangeAttendanceChanged"
          start-placeholder="Start date"
          end-placeholder="End date"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="col-12 text-right">
      <el-button @click="exportAttendance">Export</el-button>
    </div>
    <div class="col-md-12 p-0 mt-5">
      <el-timeline>
        <el-timeline-item
          v-for="(attendance, index) in attendances"
          :key="index"
          :timestamp="attendance.date"
          placement="top"
        >
          <el-card>
            <h4>{{ attendance.data.length }} People attended</h4>

            <p
              v-for="(employee, attendance_id) in attendance.data"
              :key="attendance_id"
            >
              {{ attendance_id + 1 }}. {{ employee.employee.name }}.
              <el-tag type="success"
                >{{ employee.time_arrived_at }} -
                {{ employee.time_left_at }}</el-tag
              >
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="attendance_report.pdf"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        :pdf-margin="10"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <section slot="pdf-content" ref="html2Pdf_content"></section>
      </vue-html2pdf>
    </div>
  </div>
</template>

<script>
import { bus } from "@/plugins/bus.js";
import { mapGetters, mapActions } from "vuex";
import * as XLSX from "xlsx";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "attendance",
  components: {
    VueHtml2pdf,
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      attendances: "attendance/attendances",
    }),
  },
  data: () => {
    return {
      dateRangeAttendance: [new Date(), new Date()],
    };
  },
  mounted() {
    let from = this.dateRangeAttendance[0];
    from.setDate(from.getDate() - 1);

    let to = this.dateRangeAttendance[1];
    to.setDate(to.getDate() - 1);

    this.dateRangeAttendanceChanged([from, to]);
  },

  methods: {
    ...mapActions({
      fetchAttendance: "attendance/fetchAttendances",
      exportAttendanceRequest: "attendance/exportAttendances",
    }),
    generatePDF() {
      this.$refs.html2Pdf.generatePdf();
    },
    exportAttendance: function () {
      const from = new Date(Date.parse(this.dateRangeAttendance[0]))
        .toISOString()
        .slice(0, 10);
      const to = new Date(Date.parse(this.dateRangeAttendance[1]))
        .toISOString()
        .slice(0, 10);
      bus.$emit("show-ajax-loader");

      const ctx = this;

      this.exportAttendanceRequest({
        from,
        to,
      })
        .then((data) => {
          const link = data.link;

          ctx.readExcelLink(link);

          bus.$emit("hide-ajax-loader");
        })
        .catch(() => {
          bus.$emit("hide-ajax-loader");
        });
    },
    readExcelLink: async function (link) {
      const a = document.createElement("a");
      a.setAttribute("href", link);
      a.click();

      const workbook = XLSX.read(await (await fetch(link)).arrayBuffer(), {
        WTF: 1,
      });

      const wsname = workbook.SheetNames[0];
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {
        header: 1,
      });

      const html = XLSX.utils.sheet_to_html(workbook.Sheets[wsname], {
        header: 1,
      });

      this.$refs.html2Pdf_content.innerHTML = html;

      setTimeout(() => {
        this.generatePDF();
      }, 2000);

      const excellist = [];
      for (var i = 0; i < ws.length; i++) {
        excellist.push(ws[i]);
      }

      const columns = ws[0].map((r) => ({ key: r, name: r }));
      const rows = ws.slice(1).map((r) =>
        r.reduce((acc, x, i) => {
          acc[ws[0][i]] = x;
          return acc;
        }, {})
      );
    },
    dateRangeAttendanceChanged: function async(date) {
      const from = new Date(Date.parse(date[0])).toISOString().slice(0, 10);
      const to = new Date(Date.parse(date[1])).toISOString().slice(0, 10);

      bus.$emit("show-ajax-loader");

      this.fetchAttendance({
        from,
        to,
      })
        .then(() => {
          bus.$emit("hide-ajax-loader");
        })
        .catch(() => {
          bus.$emit("hide-ajax-loader");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~vue-material/theme/engine";

* {
  text-align: initial;
}
</style>
