<template>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
    >
      <template v-slot:item="{ item }">
        <tr @click="goToCheckIn(item.id)">
          <td>{{ item.id }}</td>
          <td>{{ item.month }}</td>
          <td>{{ item.week }}</td>
          <td>{{ item.join_start }}</td>
          <td>{{ item.join_end }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>รายชื่อสมาชิก</v-toolbar-title>
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
            <template v-slot:activator="{ props }">
              <v-btn class="mb-2" color="primary" dark v-bind="props">
                เพิ่มข้อมูล
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.id"
                        label="Id"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.month"
                        label="เดือนที่"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedItem.week"
                        label="สัปดาห์ที่"
                      ></v-text-field>
                    </v-col>
  
                    <div class="row">
                        <div class="col-12 col-md-4 col-sm-6">
                        <label for="join-start" class="form-label">วันที่เริ่มต้น</label>
                        <input
                            type="date"
                            id="join-start"
                            class="form-control"
                            v-model="editedItem.join_start"
                        />
                        </div>
                        <div class="col-12 col-md-4 col-sm-6">
                        <label for="join-end" class="form-label">วันที่สิ้นสุด</label>
                        <input
                            type="date"
                            id="join-end"
                            class="form-control"
                            v-model="editedItem.join_end"
                        />
                        </div>
                          <v-col cols="12" md="4" sm="6">
                              <div class="form-check form-switch">
                                  <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="statusSwitch"
                                  v-model="editedItem.status"
                                  :checked="editedItem.status === 1"
                                  @change="toggleStatus"
                                  >
                                  <label class="form-check-label" for="statusSwitch">
                                      สถานะ
                                  </label>
                              </div>
                          </v-col>
                      </div>
                    
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">
                คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </template>
  
  <script setup>
  import { useRouter } from '#app'
  import axios from 'axios'
  
  const router = useRouter()
  
  const goToCheckIn = (id) => {
    router.push(`/check_username`)
  }
  let node = 1
  if (node === 1){
    const search = ref('')
    const headers = [
      { title: '#', align: 'id', sortable: false, key: 'id' },
      { title: 'เดือนที่', key: 'month' },
      { title: 'สัปดาห์ที่', key: 'week' },
      { title: 'วันที่เริ่มต้น', key: 'join_start' },
      { title: 'วันที่สิ้นสุด', key: 'join_end' },
      { title: 'สถานะ', key: 'status' }
    ]
    const desserts = ref([])
    const dialog = ref(false)
    const dialogDelete = ref(false)
    const editedIndex = ref(-1)
    const editedItem = ref({
      id: '',
      month: '',
      week: '',
      join_start: '',
      join_end: '',
      status: 0,
    })
    const defaultItem = {
      id: '',
      month: '',
      week: '',
      join_start: '',
      join_end: '',
      status: 0,
    }
    const ids = ref(null)
  }
  
  
  const formTitle = computed(() => editedIndex.value === -1 ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล')
  
  const initialize = async () => {
    try {
      const response = await axios.get('http://localhost:7000/date_storage')
      desserts.value = response.data.check_username
    } catch (error) {
      console.error(error)
    }
  }
  
  const editItem = (item) => {
    editedIndex.value = desserts.value.indexOf(item)
    editedItem.value = { ...item }
    dialog.value = true
  }
  
  const deleteItem = (item) => {
    editedIndex.value = desserts.value.indexOf(item)
    dialogDelete.value = true
    ids.value = item.id
  }
  
  const deleteItemConfirm = async () => {
    try {
      await axios.post('http://localhost:7000/delete', null, {
        params: { id: ids.value },
      })
      closeDelete()
      initialize()
    } catch (error) {
      console.error(error)
    }
  }
  
  const save = async () => {
    if (editedIndex.value > -1) {
      try {
        await axios.post('http://localhost:7000/update_date_storage', editedItem.value)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        await axios.post('http://localhost:7000/insert_date_storage', editedItem.value)
      } catch (error) {
        console.error(error)
      }
    }
    close()
    initialize()
  }
  
  const close = () => {
    dialog.value = false
    nextTick(() => {
      editedItem.value = { ...defaultItem }
      editedIndex.value = -1
    })
  }
  
  const closeDelete = () => {
    dialogDelete.value = false
    nextTick(() => {
      editedItem.value = { ...defaultItem }
      editedIndex.value = -1
    })
  }
  
  const toggleStatus = () => {
    editedItem.value.status = editedItem.value.status === 1 ? 0 : 1
  }
  
  onMounted(() => {
    initialize()
  })
  </script>
  