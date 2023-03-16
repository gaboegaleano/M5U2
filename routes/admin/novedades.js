var express = require('express');
var router = express.Router();

var novedadesModel = require('../../models/novedadesModels')

router.get('/', async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades();

    res.render('admin/novedades', {
        layout: 'admin/layout',
        persona: req.session.nombre,
        novedades
    });
});

/*Eliminar Novedad*/
router.get('/eliminar/:id', async (req, res, next) => {
    const id = req.params.id;
    await novedadesModel.deleteNovedadesById(id);
    res.redirect(`/admin/novedades`)
});

/*Agregar Novedad*/
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    })
});

/*Insertamos la novedad en la BD*/
router.post('/agregar', async (req, res, next) => {
    try {
        /*Esto es una validacion en donde pido que haya algo en titulo, subtitulo y detalle*/
        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.detalle != "") {
            /*Si se da esta condicion me comunico con novedades y traigo funcion insertar, enviando todos los datos (req, body)*/
            await novedadesModel.insertNovedades(req.body);
            /*Guarda la info recibida y mostralo en el listado*/
            res.redirect('/admin/novedades')
            /*En el caso de no cumplirse lo anterior, tenemos lo siguiente*/
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar'), {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        }
    }
})

/*Diseño de modificar + traer la novedad elegida*/
router.get('/modificar/:id', async (req, res, next) => {
    /*Traigo informacion del ID*/
    var id = req.params.id;
    /*Me comunico con el modelo x el ID*/
    var novedad = await novedadesModel.getNovedadById(id)
    res.render('admin/modificar', {
        layout: 'admin/layout',
        /*Traigo Novedad y lo paso al Render asi lo imprimir en cada campo*/
        novedad
    });
});

/*Actualizar las novedades*/
router.post('/modificar', async (req, res, next) => {
    try {
        console.log(req.body.id);
        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            detalle: req.body.detalle
        }
        console.log(obj) //Para ver si trae los datos
        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');
    } catch (error) {
        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la Novedad'
        })
    }
});


module.exports = router;
