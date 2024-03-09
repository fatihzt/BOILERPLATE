import fs from 'fs';
import { dirname } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function ControllerCreater(modelName,mikroserviceName,methods){
  createModelFile(modelName,mikroserviceName,methods)
}

function createModelFile(modelName, mikroserviceName, methods) {
  const modelContent = `using PROJECTNAME.Core.Controllers;
  using PROJECTNAME.${mikroserviceName}.Business.Contracts;
  using PROJECTNAME.${mikroserviceName}.Business.Dto;
  using PROJECTNAME.${mikroserviceName}.Data.Models;
  using Microsoft.AspNetCore.Cors.Infrastructure;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Mvc;
  using System;
  using System.Collections.Generic;
  using System.Threading.Tasks;


  namespace PROJECTNAME.${mikroserviceName}.API.Controllers
  {
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]

    public class ${modelName}sController : ApiControllerBase
    {
        private readonly I${modelName}sService service;

        public ${modelName}sController(I${modelName}sService service)
        {
            this.service = service;
        }

          ${methods.includes("Add") ? `
            [HttpPost("Save${modelName}")]
            public async Task<ActionResult<int>> Save(${modelName}Dto dto)
            {
                var result = await service.Save(dto);
                return Ok(result);
            }` : ""}
  
          ${methods.includes("Delete") ? `
            [HttpDelete("Delete${modelName}/{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                await service.Delete(id);
                return Ok();
            }` : ""}
  
          ${methods.includes("Find") ? `
            [HttpGet("Find${modelName}/{id}")]
            public async Task<ActionResult<${modelName}Dto>> Find(int id)
            {
                var result = await service.Find(id);
                return Ok(result);
            }` : ""}
  
          ${methods.includes("GetAll") ? `
            [HttpGet("GetAll${modelName}s")]
            public async Task<IEnumerable<${modelName}Dto>> GetAll()
            {
                var result = await service.GetAll();
                return result;
            }` : ""}
    }

  }`;
const dirname = __dirname.substring(0,__dirname.length-2)

const fileName = `${dirname}\\src\\Microservices\\${mikroserviceName.replace(/\./g, '/')}\\PROJECTNAME.${mikroserviceName}.API\\Controllers\\I${modelName}sController.cs`;
fs.writeFileSync(fileName, modelContent);
console.log(`Service Creation Done: ${fileName}`);
}
