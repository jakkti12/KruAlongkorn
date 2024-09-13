<template>
  <v-data-table
    :headers="headers"
    :items="combinedData"
    :search="search"
    :sort-by="[{ key: 'id_check_in', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>เช็คชื่อสมาชิก</v-toolbar-title>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">คุณต้องการลบข้อมูลนี้ใช่หรือไม่?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import moment from 'moment-timezone'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    headers: [
      { title: 'ID', align: 'start', sortable: false, key: 'id_check_in' },
      { title: 'Name', key: 'username' },
      { title: 'Staff ID', key: 'id' },
      { title: 'Check-In Time', key: 'time' },
      { title: 'Edit/Delete', key: 'actions', sortable: false },
    ],
    combinedData: [],
    editedIndex: -1,
    editedItem: {
      id_check_in: '',
      displayName: '',
      staffId: '',
      time: '',
    },
    defaultItem: {
      id_check_in: '',
      displayName: '',
      staffId: '',
      time: '',
    },
    ids: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  async created() {
    this.initialize()
    try {
      const responseStaffs = await axios.get('http://localhost:7000/staffs')
      const dataStaffs = responseStaffs.data.staffs
      console.log('Staffs Data:', dataStaffs)

      const responseCheckins = await axios.get('http://localhost:7000/check_in')
      const dataCheckins = responseCheckins.data.check_in
      console.log('Check-ins Data:', dataCheckins)

      this.combinedData = this.mergeData(dataStaffs, dataCheckins)
      console.log('Combined Data:', this.combinedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  methods: {
    initialize() {
      this.combinedData = []
    },

    mergeData(staffs, checkins) {
      const staffMap = new Map(staffs.map(staff => [staff.id, staff]))

      console.log('Staff Map:', staffMap);

      return checkins.map(checkin => {
        console.log('Checkin Before Merge:', checkin);
        const staff = staffMap.get(checkin.staffId) || {}
        return {
          ...staff,
          staffId: staff.id,
          time: moment(checkin.time).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
          id_check_in: checkin.id_check_in // ตรวจสอบว่ามี id_check_in อยู่ที่นี่
        }
      })
    },

    editItem(item) {
      this.editedIndex = this.combinedData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.ids = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      try {
        const response = await axios.post('http://localhost:7000/delete', null, { params: { id: this.ids.id } })
        console.log('Id =>', this.ids)
        await this.initialize()
        this.closeDelete()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>

<style scoped>
/* Your styles here */
</style>
