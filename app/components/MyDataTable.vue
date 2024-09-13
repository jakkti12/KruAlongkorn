<template>
    <v-data-table
      :headers="headers"
      :items="combinedData"
      :search="search"
      :sort-by="[{ key: 'displayName', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>เช็คชื่อสมาชิก</v-toolbar-title>
          <!-- Search Field -->
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
        <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
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
        { title: 'ID', align: 'start', sortable: false, key: 'id' },
        { title: 'Name', key: 'displayName' },
        { title: 'Staff ID', key: 'staffId' },
        { title: 'Check-In Time', key: 'time' },
      ],
      combinedData: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        staffId: '',
        time: '',
      },
      defaultItem: {
        name: '',
        staffId: '',
        time: '',
      },
      ids: null,  // Initialize ids to avoid errors
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
        const dataStaffs = responseStaffs.data.check_in // Adjusted key
  
        const responseCheckins = await axios.get('http://localhost:7000/check_in')
        const dataCheckins = responseCheckins.data.check_in // Adjusted key
  
        // Merging data
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
        // Create a map of staff ID to staff details
        const staffMap = new Map(staffs.map(staff => [staff.id, staff]))
  
        // Merge staff details with check-in details
        return checkins.map(checkin => {
          const staff = staffMap.get(checkin.staffId) || {}
          return {
            ...staff,
            staffId: staff.id,  // Ensure staffId is included in the final data
            time: moment(checkin.time).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')
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
        console.log('item =>', item.id)
        this.dialogDelete = true
      },
  
      async deleteItemConfirm() {
        try {
          const response = await axios.post('http://localhost:7000/delete', { id: this.ids.id }, { params: { id: this.ids.id } })
          const data = response.data
          console.log('Id =>', this.ids)
          // Reload data
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
  
      async save() {
        try {
          if (this.editedIndex === -1) {
            const response = await axios.post('http://localhost:7000/insert', this.editedItem)
            const data = response.data
            console.log('data =>', data)
            this.combinedData.push(this.editedItem)
          } else {
            const response = await axios.post('http://localhost:7000/update', this.editedItem)
            const data = response.data
            console.log('data =>', data)
            if (this.editedIndex > -1) {
              Object.assign(this.combinedData[this.editedIndex], this.editedItem)
            }
          }
          this.close()
        } catch (error) {
          console.error('Error saving item:', error)
        }
      },
    },
  }
  </script>
  
  <style scoped>
  /* Your styles here */
  </style>
  