-เป็น app api ที่พัฒนาขึ้นด้วย nodejs, express
-database: AWS(Singapore) ของ Railway
-deploy: render

เส้นทางการตรวจสอบสิทธิ์ (Auth Routes)
POST /auth/signup - ลงทะเบียนผู้ใช้ใหม่
POST /auth/login - เข้าสู่ระบบผู้ใช้และคืนค่า JWT

ขั้นตอนเริ่มการใช้งาน
1.ต้อง Signup ก่อนโดยใช้ API POST https://be-challenge-taskmanager.onrender.com/api/v1/auth/signup ใน Body ส่งข้อมูลดังนี้
{
    "name": "yourname",
    "email": "youremail@mail.com",
    "password": "yourpassword",
    "role": "yourrole" //admin or user
}

2.Login โดยใช้ API POST https://be-challenge-taskmanager.onrender.com/api/v1/auth/login ใน Body ส่งข้อมูลดังนี้
{
    "email": "youremail@mail.com",
    "password": "yourpassword"
}

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

เส้นทางผู้ใช้ (User Routes)
GET /users - เส้นทางสำหรับ Admin เท่านั้นเพื่อดูผู้ใช้ทั้งหมด
GET /users/:id - ดูโปรไฟล์ของผู้ใช้

การใช้งาน
1.Get user ทั้งหมด(ใช้ได้เฉพาะ role admin) โดยใช้ API GET https://be-challenge-taskmanager.onrender.com/api/v1/users

2.Get user รายคนด้วย ID โดยใช้ API GET https://be-challenge-taskmanager.onrender.com/api/v1/users/:id (:id เป็น number(ตัวเลข))

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
เส้นทางการจัดการงาน (Task Routes)
POST /tasks - สร้างงานใหม่
GET /tasks - ดูงานทั้งหมด
GET /tasks/:id - ดูงานเฉพาะ
PATCH /tasks/:id - แก้ไขงาน (สำหรับเจ้าของงานหรือ Admin)
DELETE /tasks/:id - ลบงาน (สำหรับเจ้าของงานหรือ Admin)

การใช้งาน
1.สร้างงานใหม่ โดยใช้ API POST https://be-challenge-taskmanager.onrender.com/api/v1/tasks ใน Body ส่งข้อมูลดังนี้
{
    "title": "task title",
    "description": "tasktitle description",
    "status": "todo", //เช่น todo, inprogress, done
    "assignedto": 4, //id ของเจ้าของงาน หรือผู้รับผิดชอบงาน
    "duedate": 14 //จำนวนวัน คำนวณดังนี้ เวลาปัจจุบัน + duedate(จำนวนวันเป็น จำนวนเต็มลบ, 0, จำนวนเต็มลบ)
}

2.ดูงานทั้งหมด โดยใช้ API GET https://be-challenge-taskmanager.onrender.com/api/v1/tasks

3.ดูงานเฉพาะ โดยใช้ API GET https://be-challenge-taskmanager.onrender.com/api/v1/tasks/:id (:id เป็น number(ตัวเลข))
 
4.แก้ไขงาน (สำหรับเจ้าของงานหรือ Admin)  โดยใช้ API PATCH https://be-challenge-taskmanager.onrender.com/api/v1/tasks/:id (:id เป็น number(ตัวเลข)) ใน Body ส่งข้อมูลดังนี้
{
    "title": "task title",
    "description": "tasktitle description",
    "status": "todo", //เช่น todo, inprogress, done
    "assignedto": 4, //id ของเจ้าของงาน หรือผู้รับผิดชอบงาน
    "duedate": 14 //จำนวนวัน คำนวณดังนี้ เวลาปัจจุบัน + duedate(จำนวนวันเป็น จำนวนเต็มลบ, 0, จำนวนเต็มลบ)
}
**หมายเหตุ จะส่งข้อมูลแค่บางตัวก็ได้ หรือส่งแต่ข้อมูลที่อยากแก้ไข

5. ลบงาน (สำหรับเจ้าของงานหรือ Admin) โดยใช้ API DELETE https://be-challenge-taskmanager.onrender.com/api/v1/tasks/:id (:id เป็น number(ตัวเลข))

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
