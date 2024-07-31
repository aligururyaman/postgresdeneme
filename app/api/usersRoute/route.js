import { NextResponse } from "next/server";
import { createKysely } from "@vercel/postgres-kysely";
import pg from "pg";

const { Pool } = pg;

// Burada pool ile vercel postgres bağlantısını açıyoruz

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const db = createKysely();

// Tabloyu kontrol edip oluşturma fonksiyonu varsa düz geçiyor istek atar atarmaz oluşturuyor
async function ensurePersonTableExists() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS person (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL
      )
    `);
    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

//GET fonksiyonu

export async function GET(request, response) {
  // burda olup olmadığının kontrolunu yapıyoruz
  await ensurePersonTableExists();

  // burda pool u connect ediyoruz
  const client = await pool.connect();
  try {
    //SQL komutu ile GET işlemi
    const res = await client.query("SELECT * FROM person");
    return NextResponse.json({ data: res.rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request) {
  const { first_name, last_name } = await request.json();
  await ensurePersonTableExists();

  try {
    // Kişinin mevcut olup olmadığını kontrol et
    const existingPerson = await db
      .selectFrom("person")
      .select(["id"])
      .where("first_name", "=", first_name)
      .where("last_name", "=", last_name)
      .executeTakeFirst();

    if (existingPerson) {
      // Kişi mevcutsa, hiçbir şey yapma
      return NextResponse.json(
        { message: "Person already exists" },
        { status: 200 }
      );
    } else {
      // Kişi mevcut değilse, yeni kayıt ekle
      await db.insertInto("person").values({ first_name, last_name }).execute();

      return NextResponse.json(
        { message: "Person added successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return GET(req, res);
  } else if (req.method === "POST") {
    return POST(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
