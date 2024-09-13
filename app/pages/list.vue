<template>
    <h2>รายชื่อสมาชิก {{ test }}</h2>
    <ul>
        <li v-for="st in student" :key="st.id">
            <span>{{ st.id }}</span>
            <span>{{ st.username }}</span>
            <span>{{ st.level }}</span>
        </li>
    </ul>
</template>
<script>
export default {
    data: () => ({
        title : 'สมาชิก',
        student : [
        {id: 1, username: 'John', password: 1,},
        {id: 2, username: 'Ammata', password: 1,},
        {id: 3, username: 'jakkti', password: 1,}
        ],
        test: ''
    }),
    async created() {
        // โชว์ข้อมูลจาก API ลงหน้าจอ
        const response = await fetch('http://localhost:7000/liststds');
        const data =await response.json()
        this.student = data.student;
        console.log(data);
    }
}
</script>