from flask import Flask, request, jsonify, render_template, session

import psycopg2


app = Flask(__name__, static_url_path='/static')
app.secret_key = 'your_secret_key'  # Asegúrate de definir una clave secreta para las sesiones

# Configura la conexión a la base de datos
conn = psycopg2.connect(
    dbname='timer',
    user='postgres',
    password='*CAABbgaAC*AfceGFABAeAE*d-*55C24',
    host='roundhouse.proxy.rlwy.net',
    port='55021'  # Puerto predeterminado de PostgreSQL
)

@app.route('/')
def index():

    return render_template('index.html')

@app.route('/guardar-tiempo', methods=['POST'])
def guardar_tiempo():
    data = request.get_json()
    time = data['time']
    scramble = data['scramble']
    user_id = session.get('user_id')  # Obtener el ID del usuario de la sesión

    # Insertar el tiempo en la base de datos asociado al ID del usuario
    cur = conn.cursor()
    cur.execute("INSERT INTO times (session_id, time_interval, scramble, user_id) VALUES (%s, %s, %s, %s)", (1, time, scramble, user_id))
    conn.commit()
    cur.close()

    return jsonify({"message": "Tiempo guardado exitosamente"}), 200

@app.route('/timer-cube')
def index_timer():
    if 'user_id' not in session:
    # Si no hay un usuario en la sesión, crea uno nuevo y almacena su ID en la sesión
        cur = conn.cursor()
        cur.execute("INSERT INTO users DEFAULT VALUES RETURNING id;")
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        session['user_id'] = user_id
    return render_template('indexTimer.html')
@app.route('/rest')
def rest():
    return render_template('indexRest.html')

@app.route('/cubo')
def cubo():
    return render_template('cubo.html')

@app.route('/vet')
def vet():
    return render_template('veterinaria4patas.html')
@app.route('/fantasma')
def fantasma():
    return render_template('fantasma.html')


@app.route('/ao5detalle')
def ao5detalle():
    cur = conn.cursor()
    cur.execute("""
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY solve_date DESC) AS row_num,
               scramble,
               time_interval,
               ao5,
               ao12,
               ao100,
               solve_date
        FROM times
        LIMIT 5;
    """,)
    times = cur.fetchall()
    cur.close()

    times_list = []
    for row in times:
        times_list.append({
            'id': row[0],
            'row_num': row[1],
            'scramble': row[2],
            'time_interval': row[3],
            'ao5': row[4],
            'ao12': row[5],
            'ao100': row[6],
            'solve_date': row[7]
        })

    return jsonify(times_list)
    
@app.route('/ao5detalle/<int:ultimo_id>')
def ao5detalleid(ultimo_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY solve_date DESC) AS row_num,
               scramble,
               time_interval,
               ao5,
               ao12,
               ao100,
               solve_date
        FROM times
        WHERE id <= %s
        LIMIT 5;
    """, (ultimo_id,))
    times = cur.fetchall()
    cur.close()

    times_list = []
    for row in times:
        times_list.append({
            'id': row[0],
            'row_num': row[1],
            'scramble': row[2],
            'time_interval': row[3],
            'ao5': row[4],
            'ao12': row[5],
            'ao100': row[6],
            'solve_date': row[7]
        })

    return jsonify(times_list)
@app.route('/ao12detalle/<int:ultimo_id>')
def ao12detalleid(ultimo_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY solve_date DESC) AS row_num,
               scramble,
               time_interval,
               ao5,
               ao12,
               ao100,
               solve_date
        FROM times
        WHERE id <= %s
        LIMIT 12;
    """, (ultimo_id,))
    times = cur.fetchall()
    cur.close()

    times_list = []
    for row in times:
        times_list.append({
            'id': row[0],
            'row_num': row[1],
            'scramble': row[2],
            'time_interval': row[3],
            'ao5': row[4],
            'ao12': row[5],
            'ao100': row[6],
            'solve_date': row[7]
        })

    return jsonify(times_list)


    

@app.route('/ao12detalle')
def ao12detalle():
    cur = conn.cursor()
    cur.execute("""
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY solve_date DESC) AS row_num,
               scramble,
               time_interval,
               ao5,
               ao12,
               ao100,
               solve_date
        FROM times
        LIMIT 12;
    """, )
    times = cur.fetchall()
    cur.close()

    times_list = []
    for row in times:
        times_list.append({
            'id': row[0],
            'row_num': row[1],
            'scramble': row[2],
            'time_interval': row[3],
            'ao5': row[4],
            'ao12': row[5],
            'ao100': row[6],
            'solve_date': row[7]
        })

    return jsonify(times_list)
@app.route('/ao100detalle')
def ao100detalle():
    cur = conn.cursor()
    cur.execute("""
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY solve_date DESC) AS row_num,
               scramble,
               time_interval,
               ao5,
               ao12,
               ao100,
               solve_date
        FROM times
        LIMIT 100;
    """)
    times = cur.fetchall()
    cur.close()

    times_list = []
    for row in times:
        times_list.append({
            'id': row[0],
            'row_num': row[1],
            'scramble': row[2],
            'time_interval': row[3],
            'ao5': row[4],
            'ao12': row[5],
            'ao100': row[6],
            'solve_date': row[7]
        })

    return jsonify(times_list)
@app.route('/ao100detalle/<int:ultimo_id>')
def ao100detalleid(ultimo_id):
    cur = conn.cursor()
    cur.execute("""
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY solve_date DESC) AS row_num,
               scramble,
               time_interval,
               ao5,
               ao12,
               ao100,
               solve_date
        FROM times
        WHERE id <= %s
        LIMIT 100;
    """, (ultimo_id,))
    times = cur.fetchall()
    cur.close()

    times_list = []
    for row in times:
        times_list.append({
            'id': row[0],
            'row_num': row[1],
            'scramble': row[2],
            'time_interval': row[3],
            'ao5': row[4],
            'ao12': row[5],
            'ao100': row[6],
            'solve_date': row[7]
        })

    return jsonify(times_list)


@app.route('/mejortiempo')
def get_mejores():
    # Ejecutar una consulta para obtener los tiempos de la base de datos
    cur = conn.cursor()
    cur.execute("""
 		
WITH ranked_times AS (
    SELECT 
        id,
        time_interval,
        ao5,
        ao12,
        ao100,
        ROW_NUMBER() OVER (ORDER BY time_interval) AS min_time_rank,
        ROW_NUMBER() OVER (ORDER BY ao5) AS min_ao5_rank,
        ROW_NUMBER() OVER (ORDER BY ao12) AS min_ao12_rank,
        ROW_NUMBER() OVER (ORDER BY ao100) AS min_ao100_rank
    FROM 
        times
    WHERE 
        session_id = 1
)
SELECT 
    MIN(time_interval) AS mejortiempo,
    MIN(ao5) AS mejorao5,
    MIN(ao12) AS mejorao12,
	    MIN(ao100) AS mejorao100,

	    (SELECT id FROM ranked_times WHERE min_time_rank = 1) AS id_mejortiempo,
		    (SELECT id FROM ranked_times WHERE min_ao5_rank = 1) AS id_mejorao5,    
(SELECT id FROM ranked_times WHERE min_ao12_rank = 1) AS id_mejorao12,

    (SELECT id FROM ranked_times WHERE min_ao100_rank = 1) AS id_mejorao100

FROM 
    ranked_times;

    """, )
    times = cur.fetchall()
    cur.close()
    
    # Convertir los tiempos en una lista de diccionarios
    mejor = [{"mejortiempo": time[0], "mejorao5": time[1], "mejorao12": time[2],  "mejorao100": time[3], "id_mejortiempo": time[4], "id_mejorao5": time[5], "id_mejorao12": time[6],  "id_mejorao100": time[7]} for time in times]

    return jsonify(mejor)

@app.route('/times')
def get_times():    
    # Ejecutar una consulta para obtener los tiempos de la base de datos
    cur = conn.cursor()
    cur.execute("SELECT time_interval, ao5, ao12, ao100, indice, id FROM times ORDER BY solve_date DESC ")
    times = cur.fetchall()
    cur.close()
    
    # Convertir los tiempos en una lista de diccionarios
    times_list = [{"time_interval": time[0], "ao5": time[1], "ao12": time[2], "ao100": time[3], "indice": time[4], "id": time[5]} for time in times]

    return jsonify(times_list)
@app.route('/get_time_difference')
def get_time_difference():
    cur = conn.cursor() 
    cur.execute("""
        SELECT 
            (SELECT time_interval FROM times ORDER BY solve_date DESC LIMIT 1) - 
            (SELECT time_interval FROM times ORDER BY solve_date DESC LIMIT 1 OFFSET 1) AS difference;
    """)
    
    # Obtener el resultado
    difference = cur.fetchone()[0]

    cur.close()

    # Devolver la diferencia como JSON
    return jsonify({'difference': difference})
@app.route('/ejecutar-main-timer')
def ejecutar_main():
    # Aquí puedes poner el código para ejecutar main.py
    # Por ejemplo:
    import os
    os.system('python main.py')
    return 'Se ejecutó main.py'



from agua import ejecutar_algoritmo_genetico
import agua
@app.route('/agua')
def aguas():
    return render_template('indexAgua.html')

@app.route('/resultados')
def resultados():
    mejor_solucion = ejecutar_algoritmo_genetico()
    data_grafico = [{'distrito': distrito, 'asignacion': asignacion} for distrito, asignacion in mejor_solucion.items()]
    total_litros = sum(mejor_solucion.values())
    demanda = agua.demanda_agua
    total_demanda = sum(demanda)
    return render_template("resultados.html", mejor_solucion=mejor_solucion, data_grafico=data_grafico, total_litros=total_litros, demanda=demanda, total_demanda=total_demanda)


@app.route('/update-agua', methods=['POST'])
def update_agua():
    global agua_disponible
    agua_disponible = int(request.form['aguaDisponible'])
    agua.agua_disponible = agua_disponible 
    return 'Configuración exitosa.', 200

if __name__ == '__main__':
    app.run(debug=False)
