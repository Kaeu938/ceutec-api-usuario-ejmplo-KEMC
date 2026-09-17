from flask import Flask, jsonify, request
from conexion import ConexionDB  


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Kaeu0998'
app.config['MYSQL_DB'] = 'FACTURA'

db = ConexionDB(
    app.config['MYSQL_HOST'],
    app.config['MYSQL_USER'],
    app.config['MYSQL_PASSWORD'],
    app.config['MYSQL_DB']
)

@app.route('/')
def index():
    return 'Hola Mundo'


@app.route('/articulos', methods=['GET'])
def listar_articulos():
    try:
        cursor = db.obtener_cursor()
        cursor.execute("SELECT CodArticulo, Nombre, Descripcion, Precio_unidad, Unidades_en_stock, Stock_de_Seguridad, Imagen FROM ARTICULOS")
        datos = cursor.fetchall()
        articulos = [{
            'CodArticulo': fila[0],
            'Nombre': fila[1],
            'Descripcion': fila[2],
            'Precio_unidad':float(fila[3]) if fila[3] is not None else 0.0,
            'Unidades_en_stock': fila[4],
            'Stock_de_Seguridad': fila[5],
            'Imagen': fila[6]
        } for fila in datos]
        cursor.close()
        return jsonify(
            {
                'articulos': articulos,
                'mensaje': 'Articulos listados correctamente',
                'exito': True
            }
        )
    except Exception as e:
        return jsonify({
            'mensaje': f'Error al listar articulos: {str(e)}',
            'exito': False
        }),500
    
def leer_articulo_por_id(id):
    try:
        cursor = db.obtener_cursor()
        cursor.execute('SELECT CodArticulo, Nombre, Descripcion, Precio_unidad, Unidades_en_stock, Stock_de_Seguridad, Imagen FROM ARTICULOS WHERE CodArticulo={0}'.format(id,))
        datos = cursor.fetchone()
        cursor.close()
        if datos !=None:
            return {
                'CodArticulo': datos[0],
                'Nombre': datos[1],
                'Descripcion': datos[2],
                'Precio_unidad': float(datos[3]) if datos[3] is not None else 0.0,
                'Unidades_en_stock': datos[4],
                'Stock_de_Seguridad': datos[5],
                'Imagen': datos[6]
            }
        else:
            return None
    except Exception as e:
        raise e
    
@app.route('/articulos/<int:id>', methods=['GET'])
def listar_articulo_id(id):
    try:
        articulo = leer_articulo_por_id(id)
        if articulo:
            return jsonify({
                "articulo": articulo,
                "mensaje": "Articulo encontrado",
                "exito": True
            })
        else:
            return jsonify({
                'mensaje': f'Articulo no encontrado',
                'exito': False
            }),404
    except Exception as e:
        return jsonify({
            'mensaje': f'Error al listar articulos: {str(e)}',
            'exito': False
        }), 500
                

@app.route('/articulos', methods=['POST'])
def crear_articulo():
    try:
        if(request.json['Nombre'] and request.json['Precio_unidad'] is not None):
            cursor = db.obtener_cursor()
            sql="""INSERT INTO ARTICULOS(Nombre, Descripcion, Precio_unidad, Unidades_en_stock, Stock_de_Seguridad, Imagen)
                VALUES('{0}', '{1}', '{2}', '{3}', '{4}','{5}')""".format(request.json['Nombre'], request.json.get('Descripcion'), request.json['Precio_unidad'], request.json.get('Unidades_en_stock',0), request.json.get('Stock_de_Seguridad',0), request.json.get('Imagen','')
                 )
            cursor.execute(sql)
            db.conexion.commit()
            cursor.close()
                
            return jsonify({
                    'mensaje': 'Articulo creado correctamente',
                    'exito': True
                })
        else:
            return jsonify({
                'mensaje': 'Parametros invalidos',
                'exito': False
            }), 400
    except Exception as e:
        return jsonify({
            'mensaje': f'Error al crear articulo: {str(e)}',
            'exito': False
        }), 500        
        
        
@app.route('/articulos/<int:id>', methods=['PUT'])
def actualizar_articulo(id):
    try:
        if(request.json['Nombre'] and request.json['Precio_unidad'] is not None):
            articulo_update = leer_articulo_por_id(id)
            if articulo_update != None:
                cursor = db.obtener_cursor()
                sql = """UPDATE ARTICULOS SET Nombre='{0}', Descripcion='{1}', Precio_unidad='{2}', Unidades_en_stock='{3}', Stock_de_Seguridad='{4}', Imagen='{5}' WHERE CodArticulo={6}""".format(
                    request.json['Nombre'], request.json.get('Descripcion', ''), request.json['Precio_unidad'], request.json.get('Unidades_en_stock', 0), request.json.get('Stock_de_Seguridad', 0), request.json.get('Imagen', ''), id)
                cursor.execute(sql)
                db.conexion.commit()
                cursor.close()
                
                return jsonify({
                    'mensaje': 'Articulo actualizado correctamente',
                    'exito': True
                })
            else:
                return jsonify({
                    'mensaje': 'Articulo no encontrado',
                    'exito': False
                }), 404
        else:
            return jsonify({
                'mensaje': 'Parametros invalidos',
                'exito': False
            }), 400
    except Exception as e:
        return jsonify({
            'mensaje': f'Error al actualizar articulo: {str(e)}',
            'exito': False
        }), 500
        
@app.route('/articulos/<int:id>', methods=['DELETE'])
def eliminar_articulo(id):
    try:
        articulo_delete = leer_articulo_por_id(id)
        if articulo_delete != None:
            cursor = db.obtener_cursor()
            sql = """DELETE FROM ARTICULOS WHERE CodArticulo={0}""".format(id)
            cursor.execute(sql)
            db.conexion.commit()
            cursor.close()
            return jsonify({
                'mensaje': 'Articulo eliminado correctamente',
                'exito': True
            })
        else:
            return jsonify({
                'mensaje': 'Articulo no encontrado',
                'exito': False
            }), 404
    except Exception as e:
        return jsonify({
            'mensaje': f'Error al eliminar articulo: {str(e)}',
            'exito': False
        }), 500
